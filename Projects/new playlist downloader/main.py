import os
import yt_dlp
from PIL import Image, UnidentifiedImageError
from mutagen.mp4 import MP4, MP4Cover
from mutagen.id3 import ID3, APIC, error
from mutagen.easyid3 import EasyID3
import sys

# Ensure the directories exist
os.makedirs('temp/audio', exist_ok=True)

# Set the URL of the playlist you want to download
if len(sys.argv) > 1:
    playlist_url = sys.argv[1]  # Get the URL from command line arguments
else:
    playlist_url = input("Enter the playlist URL: ")  # Prompt for the URL if not provided'

# Configure yt-dlp options
ytdlp_opts = {
    'format': 'bestaudio/best',  # Download best audio quality
    'extractaudio': True,        # Extract audio
    'audioquality': 0,           # Best quality
    # Output template for audio files
    'outtmpl': 'temp/audio/%(title)s.%(ext)s',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',  # Correct postprocessor for audio extraction
        'preferredcodec': 'm4a',
        'preferredquality': '192',
    }],
    'writethumbnail': True,      # Download thumbnail images
    'writeinfojson': False,      # Don't write extra metadata
    'postprocessor_args': ['-strict', '-2'],
    'quiet': False,              # Display progress
    'merge_output_format': 'm4a',  # Merge as M4A
}


def download_audio_and_cover(playlist_url):
    # Download the playlist
    with yt_dlp.YoutubeDL(ytdlp_opts) as ydl:
        ydl.download([playlist_url])


def crop_and_resize_all_images_in_directory(directory, size=(1000, 1000)):
    """
    Crops all images in the specified directory into squares and resizes them to the given size.

    :param directory: Path to the directory containing images.
    :param size: Tuple specifying the target size (width, height).
    """
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        if os.path.isfile(file_path):
            try:
                with Image.open(file_path) as img:
                    width, height = img.size
                    # Determine the size of the square
                    square_size = min(width, height)
                    # Calculate cropping box
                    left = (width - square_size) // 2
                    top = (height - square_size) // 2
                    right = left + square_size
                    bottom = top + square_size
                    # Crop the image
                    cropped_img = img.crop((left, top, right, bottom))
                    # Resize the image
                    resized_img = cropped_img.resize(size, Image.ANTIALIAS)
                    # Save the resized image
                    output_path = os.path.join(directory, filename)
                    resized_img.save(output_path)
                    print(f"Cropped and resized: {output_path}")
            except UnidentifiedImageError:
                print(f"Skipped non-image file: {file_path}")

def set_audio_thumbnail(audio_file, image_file):
    """
    Embeds the image as the album art of the audio file.

    :param audio_file: Path to the audio file.
    :param image_file: Path to the image file.
    """
    try:
        if audio_file.endswith('.m4a'):
            # For M4A files
            audio = MP4(audio_file)
            with open(image_file, 'rb') as img:
                audio['covr'] = [MP4Cover(img.read(), imageformat=MP4Cover.FORMAT_JPEG)]
            audio.save()
            print(f"Set album art for: {audio_file}")
        elif audio_file.endswith('.mp3'):
            # For MP3 files
            audio = ID3(audio_file)
            with open(image_file, 'rb') as img:
                audio.add(APIC(
                    mime='image/jpeg',  # MIME type of the image
                    type=3,             # Front cover
                    desc='Cover',
                    data=img.read()
                ))
            audio.save()
            print(f"Set album art for: {audio_file}")
        else:
            print(f"Unsupported audio format: {audio_file}")
    except error as e:
        print(f"Failed to set album art for {audio_file}: {e}")

def process_audio_and_images(directory):
    """
    Processes all audio files in the directory and sets their respective images as album art.

    :param directory: Path to the directory containing audio and image files.
    """
    for filename in os.listdir(directory):
        if filename.endswith('.m4a') or filename.endswith('.mp3'):
            audio_file = os.path.join(directory, filename)
            # Assume the image has the same name as the audio file but with a .webp extension
            image_file = os.path.join(directory, f"{os.path.splitext(filename)[0]}.webp")
            if os.path.exists(image_file):
                # Convert .webp to .jpg for compatibility
                converted_image_file = os.path.join(directory, f"{os.path.splitext(filename)[0]}.jpg")
                try:
                    with Image.open(image_file) as img:
                        img = img.convert("RGB")  # Convert to RGB mode
                        img.save(converted_image_file, "JPEG")
                        print(f"Converted {image_file} to {converted_image_file}")
                except UnidentifiedImageError:
                    print(f"Skipped invalid image file: {image_file}")
                    continue

                # Set the converted image as album art
                set_audio_thumbnail(audio_file, converted_image_file)
            else:
                print(f"No matching image found for: {audio_file}")

def set_artist_and_album(directory, playlist_name):
    """
    Sets the artist and album metadata for all audio files in the directory.

    :param directory: Path to the directory containing audio files.
    :param playlist_name: Name of the playlist to set as the artist and album.
    """
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        if filename.endswith('.mp3'):
            try:
                audio = EasyID3(file_path)
                audio['artist'] = playlist_name
                audio['album'] = playlist_name
                audio.save()
                print(f"Set artist and album for: {file_path}")
            except Exception as e:
                print(f"Failed to set metadata for {file_path}: {e}")
        elif filename.endswith('.m4a'):
            try:
                audio = MP4(file_path)
                audio['\xa9ART'] = [playlist_name]  # Artist
                audio['\xa9alb'] = [playlist_name]  # Album
                audio.save()
                print(f"Set artist and album for: {file_path}")
            except Exception as e:
                print(f"Failed to set metadata for {file_path}: {e}")

def get_playlist_name(playlist_url):
    """
    Extracts the playlist name using yt-dlp.

    :param playlist_url: URL of the playlist.
    :return: The name of the playlist.
    """
    with yt_dlp.YoutubeDL({'quiet': True}) as ydl:
        info = ydl.extract_info(playlist_url, download=False)  # Extract metadata without downloading
        return info.get('title', 'Unknown Playlist')  # Return the playlist title or a default value

def delete_webp_images(directory):
    """
    Deletes all .webp images in the specified directory.

    :param directory: Path to the directory containing .webp images.
    """
    for filename in os.listdir(directory):
        if filename.endswith('.webp') or filename.endswith('.jpg'):
            file_path = os.path.join(directory, filename)
            try:
                os.remove(file_path)
                print(f"Deleted: {file_path}")
            except Exception as e:
                print(f"Failed to delete {file_path}: {e}")

#levae the below stuff in comments for now. ill uncomment it later but im testing each function separately.
download_audio_and_cover(playlist_url)
crop_and_resize_all_images_in_directory('temp/audio')
process_audio_and_images('temp/audio')
set_artist_and_album('temp/audio', get_playlist_name(playlist_url))
delete_webp_images('temp/audio')