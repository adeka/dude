var interact = false;
function Door(game,x,y, group, name, props){
	this.open = false;
	this.sprite = game.add.sprite(x, y, 'door');
	this.sprite.dest = {x:props.destX, y: props.destY};

	this.sprite.name = name;
	this.sprite.scale = {x:5,y:5};
	this.sprite.smoothed = false;
	this.sprite.animations.add('open',[0,1,2,3,4]);
	game.physics.arcade.enable(this.sprite);
	//this.sprite.body.enable = false;
	this.sprite.body.allowGravity = false;
	this.sprite.body.immovable = true;
	//
	group.add(this.sprite);
}

function DoorSide(game,x,y, group, name, props){
	this.open = false;
	this.sprite = game.add.sprite(x, y, 'doorSide');
	this.sprite.dest = {x:props.destX, y: props.destY};

	this.sprite.name = name;
	this.sprite.scale = {x:5,y:5};
	this.sprite.smoothed = false;
	this.sprite.animations.add('open',[0,1,2,3,4]);
	this.sprite.animations.add('close',[4,3,2,1,0]);
	game.physics.arcade.enable(this.sprite);
	//this.sprite.body.enable = false;
	this.sprite.body.allowGravity = false;
	this.sprite.body.immovable = true;
	//
	group.add(this.sprite);
}

function atDoor(player, door){
	if(interact){
		console.log(door.name);
		interact = false;
		door.animations.play('open', 8, false);
		var game = this;
		this.frozen = true;
		setTimeout(function() {
			game.load_level(door.name, parseInt(door.dest.x), parseInt(door.dest.y));
		}, 600);
	}
}

function atSideDoor(player, door){
	if(!door.open){
		if(player.position.x < door.position.x && this.velocity > 0){
			this.velocity = 0;
		}
		else if(player.position.x > door.position.x && this.velocity < 0){
			this.velocity = 0;
		}
	}
	if(interact && !door.open){
		interact = false;
		door.open = true;
		door.animations.play('open', 8, false);
		var game = this;
		door.body.enable = false;
	}
	if(interact && door.open){
		interact = false;
		door.open = false;
		door.animations.play('close', 8, false);
		var game = this;
		setTimeout(function() {
			door.body.enable = true;
		}, 600);
	}
}

var play_state = {
	preload: function() {

	},

	create: function() {



		this.wallGroup = this.game.add.group();
		this.doorGroup = this.game.add.group();
		this.sideDoorsGroup = this.game.add.group();
		//this.doorGroup.enableBody = true;

		this.game.physics.startSystem(Phaser.Physics.ARCADE)
		this.game.physics.arcade.gravity.y = 200;
		this.game.stage.smoothed = false;
		this.velocity = 0;
		this.running = false
		this.attacking = false;

		//add character sprite and animations
		this.character = this.game.add.sprite(0, 0, 'legs');
		this.character.scale = {x:5,y:5};
		this.character.anchor = {x:.5, y : .5};


		this.torso = this.game.add.sprite(0, -5, 'torso');
		this.torso.anchor = {x:.5, y : .5};

		this.head = this.game.add.sprite(.5, -9, 'headIdle');
		this.head.anchor = {x:.5, y : .5};

		this.character.addChild(this.torso);
		this.torso.addChild(this.head);

		 //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
   		//this.mummy.animations.add('walk');

    	//this.mummy.animations.play('walk', 20, true);


   		this.character.animations.add('walk',[0,1,2,3]);
   		this.character.animations.add('stop',[4,5,6,7]);
   		this.character.animations.add('jumpUp',[8]);
   		this.character.animations.add('jumpForward',[9]);

   		this.torso.animations.add('walk',[0,1,2,3]);
   		this.character.animations.add('idle', [0]);
   		this.torso.animations.add('idle', [0]);
   		this.torso.animations.add('jump',[3]);
   		this.torso.animations.add('punch',[4,5,6,7,7,6,5,4]);

		this.character.smoothed = false;
		this.torso.smoothed = false;
		this.head.smoothed = false;

		this.overlayGroup = this.game.add.group();


		this.load_level("house", 400, 1000);

		this.left = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.right = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
		this.down = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.up = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.attack = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
		this.jumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


		this.attack.onDown.add(function() {
			this.attacking = true;
		}, this);

		this.right.onDown.add(function() {
			this.velocity = 1;
			this.character.scale = {x:5,y:5};
			this.running = true;
		}, this);
		this.left.onDown.add(function() {
			this.velocity = -1;
			this.character.scale = {x:-5,y:5};
			this.running = true;
		}, this);
		this.down.onDown.add(function() {
			this.crouch=true;
		}, this);
		this.up.onDown.add(function() {
			interact=true;
		}, this);
		this.jumpKey.onDown.add(function() {
			this.jump=true;
		}, this);


		this.right.onUp.add(function() {
			this.running=false;
		}, this);
		this.left.onUp.add(function() {
			this.running=false;
		}, this);
		this.up.onUp.add(function() {interact=false;}, this);
		this.jumpKey.onUp.add(function() {this.jump=false;}, this);

		this.torso.body.enable = false;
		this.head.body.enable = false;

		this.character.body.setSize(10, 20, 0, -40);



	},

	update: function() { 
		if(this.frozen){
			this.running = false;
			this.jump = false;
			this.velocity = 0;
		}
		this.game.physics.arcade.overlap(this.character, this.doorGroup, atDoor, null, this);
		this.game.physics.arcade.overlap(this.character, this.sideDoorsGroup, atSideDoor, null, this);
		this.game.physics.arcade.collide(this.character, this.layer);

		if(this.punching && this.punching.isFinished){
			this.attacking = false;
			this.punching = null;
		}

		if(this.velocity <= .1 && this.velocity >= -.1){
			this.velocity = 0;
		}

		if (this.jump && this.character.body.onFloor()) {
			this.character.body.velocity.y = -550;
		}

		this.character.body.velocity.x = this.velocity * 170;

		if(this.running){

    		this.character.animations.play('walk', 8, true);
	    	this.torso.animations.play('walk', 8, true);
			
		}
		else if(this.velocity > 0 || this.velocity<0){
			this.velocity *= .9;
    		this.character.animations.play('stop', 8, false);

    			this.torso.animations.play('idle', 8, true);
		}
		else if(this.character.body.onFloor()){
			this.character.animations.play('idle', 8, false);
	    	if(this.attacking || (this.punching && !this.punching.isFinished)){
	    		this.punching = this.torso.animations.play('punch', 16, false);
			}
			else{
				this.torso.animations.play('idle', 8, false);
			}
		}
		if (!this.character.body.onFloor()) {
			if(this.running){
				this.character.animations.play('jumpForward', 8, false);
			}
			else{
				this.character.animations.play('jumpUp', 8, false);
			}
			this.torso.animations.play('jump', 8, false);
		}

		if(this.level=="house" && this.character.position.x < 0){
			this.load_level("houseFront", 1200,1000);
		}
		if(this.level=="townHouse" && this.character.position.x < 0){
			this.load_level("houseFront", 2000,1000);
		}
		if(this.level=="house" && this.character.position.x > 800){
			this.load_level("houseBack", 400,1000);
		}
},



load_level: function(level, x, y) {
	this.frozen = false;

	this.wallGroup.removeAll();
	this.doorGroup.removeAll();
	this.overlayGroup.removeAll();
	this.sideDoorsGroup.removeAll();

	if(level == "houseFront" || level == "houseBack"){
		this.game.stage.setBackgroundColor(0x7EC0EE);
	}
	else{
		this.game.stage.setBackgroundColor(0x000000);
	}

	if(level == "house"){
		this.map = this.game.add.tilemap('house');
	}
	else{
		this.map = this.game.add.tilemap(level);
	}
	this.map.addTilesetImage('tilesetBig', 'tilesetBig');

	
	this.layer2 = this.map.createLayer('walls',1024,1024,this.wallGroup);	
	this.layer3 = this.map.createLayer('subDecals',1024,1024,this.wallGroup);	
	this.layer4 = this.map.createLayer('decals',1024,1024,this.wallGroup);	
	
	this.layer = this.map.createLayer('layer',1024,1024,this.wallGroup);	

	this.overlay = this.map.createLayer('overlay',1024,1024,this.overlayGroup);	

	this.layer.resizeWorld();
	this.map.setCollisionBetween(0, 3000, true, "layer", true );

	var result = this.findObjectsByType(this.map, 'objectsLayer');
 
    result.forEach(function(element){
 		new Door(this.game, element.x, element.y, this.doorGroup, element.name, element.properties);
    }, this);

    if(this.map.objects['doorSide']){
		var doorSide = this.findObjectsByType(this.map, 'doorSide');
	 	if(doorSide){
		    doorSide.forEach(function(element){
	 			new DoorSide(this.game, element.x, element.y, this.sideDoorsGroup, element.name, element.properties);
	    	}, this);
	 	}
    }




	this.game.physics.enable([this.character, this.layer]);

	this.character.body.velocity.x = 0;
	this.character.body.velocity.y = 0;
	this.character.position.setTo(x, y);
	this.character.body.gravity.y = 500;

	this.game.camera.follow(this.character);

	this.level = level;
},

//find objects in a Tiled layer that containt a property called "type" equal to a certain value
 
  findObjectsByType: function(map, layerName) {
    var result = [];
    map.objects[layerName].forEach(function(element){
        result.push(element);
    });
    return result;
  },
 
die : function() {
	/*
	this.character.anchor.setTo(0.5, 0.5);
	var t = this.game.add.tween(this.character).to({angle:360}, 300).start();
	this.character.body.gravity.y = 0;
	this.character.body.velocity.x = 0;
	this.character.body.velocity.y = 0;
	t.onComplete.add(function() {
		this.load_level(this.level);
	}, this);
*/
},
};
