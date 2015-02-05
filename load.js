var load_state = {
    preload: function() {
	game.stage.setBackgroundColor(0x000000);

	text = this.game.add.text(250, 250, "loading..", {
	    font: '30px Arial',
	    fill: '#FFFFFF'
	});

	this.game.load.tilemap('house', 'level/house.json', null, Phaser.Tilemap.TILED_JSON);
	this.game.load.tilemap('room1', 'level/room1.json', null, Phaser.Tilemap.TILED_JSON);
	this.game.load.tilemap('room2', 'level/room2.json', null, Phaser.Tilemap.TILED_JSON);
	this.game.load.tilemap('room3', 'level/room3.json', null, Phaser.Tilemap.TILED_JSON);
	this.game.load.tilemap('room4', 'level/room4.json', null, Phaser.Tilemap.TILED_JSON);
	this.game.load.tilemap('room5', 'level/room5.json', null, Phaser.Tilemap.TILED_JSON);
	this.game.load.tilemap('houseFront', 'level/houseFront.json', null, Phaser.Tilemap.TILED_JSON);
	this.game.load.tilemap('houseBack', 'level/houseBack.json', null, Phaser.Tilemap.TILED_JSON);
	this.game.load.image('tilesetBig', 'assets/tilesetBig.png');

	this.game.load.spritesheet('character', 'assets/character.png');

	this.game.load.spritesheet('legs', 'assets/legs/legs.png', 10, 4, 12);
	this.game.load.spritesheet('door', 'assets/door.png', 12, 22, 5);
	this.game.load.spritesheet('torso', 'assets/torso/torso.png', 16, 6, 8);
	this.game.load.image('headIdle', 'assets/head/idle.png');


    },

    create: function() {
	game.state.start('play');
    },
};
