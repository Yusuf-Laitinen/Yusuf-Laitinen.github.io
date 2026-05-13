import urllib.parse
import requests
import json


def _encode_form_data(data: dict) -> str:
    """Helper function to encode form data in URL-encoded format."""
    return urllib.parse.urlencode(data)


def send_data(url: str, form_data: dict, user: str, row) -> str:
    """Send form data via POST request."""
    form_data = form_data.copy()
    form_data["user"] = user
    form_data["row"] = row

    form_data_string = _encode_form_data(form_data)
    print(form_data_string)

    response = requests.post(
        url,
        data=form_data_string,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    if response.ok:
        return response.text
    else:
        raise RuntimeError("Failed to submit the form.")


def get_data(url: str, user: str):
    """Fetch data for a given user via GET request."""
    try:
        response = requests.get(url, params={"user": user})
        response.raise_for_status()
        return response.json()
    except (requests.RequestException, json.JSONDecodeError) as e:
        print(e)
        return "No data found"


def get_sheet_names(url: str) -> list:
    """Fetch all sheet names via GET request."""
    try:
        response = requests.get(url, params={"action": "getSheetNames"})
        response.raise_for_status()
        return response.json()
    except (requests.RequestException, json.JSONDecodeError) as e:
        print(e)
        return []