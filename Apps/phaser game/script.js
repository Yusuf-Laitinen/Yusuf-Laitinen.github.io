let addedApples = false;

class Example extends Phaser.Scene {
    preload() {
        this.gameEnded = false;
        this.x = 195;
        this.y = 422;

        this.previousX = [195];
        this.previousY = [422];

        this.bodySegments = [];

        this.appleCount = 4;

        this.load.image('head', 'assets/head.png');
        this.load.image('body', 'assets/body.png');
        this.load.image('apple', 'assets/apple.png');
        this.load.image('game-over', 'https://media.istockphoto.com/id/1325433246/video/game-over-text-animation-with-alpha-channel-4k.jpg?s=640x640&k=20&c=aZM_cNmjuXVVkLm12evzXTU0qFhAu3Vh2_2W_h-eq3c=');

    }

    tapped() {
        if (this.gameEnded) {
            this.scene.restart();
        } else {
            if (this.direction < 4) {
                this.direction += 1;
            } else {
                this.direction = 1;
            }
        }
    }

    create() {
        this.appleGroup = this.physics.add.group();
        if (!addedApples) {
            for (let i = 0; i < this.appleCount; i++) {
                this.physics.add.existing(this.appleGroup.create(Math.random() * config.width, Math.random() * config.height, "apple"))
            }
            addedApples = true;
        }
        this.direction = 1;
        this.snake = this.add.image(this.x, this.y, 'head');
        this.physics.add.existing(this.snake)
        this.physics.add.overlap(this.snake, this.applesGroup, this.collectApple, null, this);
        
        this.input.on('pointerdown', this.tapped, this);
    }

    update() {
        if (this.direction == 1) {
            this.snake.x += 2;
        } else if (this.direction == 2) {
            this.snake.y += 2;
        } else if (this.direction == 3) {
            this.snake.x -= 2;
        } else if (this.direction == 4) {
            this.snake.y -= 2;
        }

        if (this.snake.x > config.width - 32 || this.snake.x < 32 || this.snake.y > config.height - 32 || this.snake.y < 32) {
            this.direction = 1;
            this.gameEnded = true;
        }

        if (this.gameEnded) {
            this.add.image(195, 442, "game-over");
        }

        this.previousX.push(this.snake.x);
        this.previousY.push(this.snake.y);
        console.log(this.previousX);
    }

    collectApple(snake, apple) {
        apple.x = Math.random * config.width
        apple.y = Math.random * config.height
        this.bodySegments.push(this.add.image(this.previousX[this.bodySegments.length], this.previousY[this.bodySegments.length], 'body'))
    }

}

const config = {
    type: Phaser.AUTO,
    width: 390,
    height: 844,
    scene: Example,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            }
        }
    }
};

const game = new Phaser.Game(config);
