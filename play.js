var interact = false;

var upwardSlopes = [149]; //list of tiles that slope up from left to right
var downwardSlopes = [200]; //list of tiles that slope down from left to right


function MoveDust(game, character, dir){
	if(dir == 1){
		var moveDust = game.add.sprite(character.x - 50, character.y - 35, 'moveDust');
	}
	else{
		var moveDust = game.add.sprite(character.x + 50, character.y - 35, 'moveDust');
	}
	moveDust.scale = {x : 1 * dir, y : 1};
	moveDust.alpha = .6;
	var anim = moveDust.animations.add('move',[0,1,2,3,4,5,6,7,8,9,10]);
	moveDust.animations.play('move', 10);
	anim.killOnComplete = true;
}

function LandDust(game, character, dir){
	var landDust = game.add.sprite(character.x - 70, character.y - 20, 'landDust');
	landDust.scale = {x : .6, y : .6};
	landDust.alpha = .6;
	var anim = landDust.animations.add('move',[0,1,2,3,4,5]);
	landDust.animations.play('move', 10);
	anim.killOnComplete = true;
}

function JumpDust(game, character, dir){
	var landDust = game.add.sprite(character.x - 30, character.y - 70, 'jumpDust');
	landDust.scale = {x : 1, y : 1.7};
	landDust.alpha = .4;
	var anim = landDust.animations.add('move',[0,1,2,3,4,5,6,7]);
	landDust.animations.play('move', 10);
	anim.killOnComplete = true;
}

function StopDust(game, character, dir){
	if(dir == 1){
		var stopDust = game.add.sprite(character.x + 90, character.y - 20, 'dust');
	}
	else{
		var stopDust = game.add.sprite(character.x - 90, character.y - 20, 'dust');
	}
	stopDust.scale = {x : -.7 * dir, y : .7};
	stopDust.alpha = .6;
	var anim = stopDust.animations.add('move',[0,1,2,3,4,5,6,7]);
	stopDust.animations.play('move', 12);
	anim.killOnComplete = true;
}

function Door(game,x,y, group, name, props){
	this.open = false;
	this.sprite = game.add.sprite(x, y, 'door');
	this.sprite.dest = {x:props.destX, y: props.destY};
	this.sprite.name = name;
	this.sprite.scale = {x:5,y:5};
	this.sprite.smoothed = false;
	this.sprite.animations.add('open',[0,1,2,3,4]);
	group.add(this.sprite);
}

function DoorSide(game,x,y, group, name, props){
	this.open = false;
	this.sprite = game.add.sprite(x + 27, y + 60, 'doorSide');
	this.sprite.dest = {x:props.destX, y: props.destY};
	this.sprite.name = name;
	this.sprite.scale = {x:5,y:5};
	this.sprite.smoothed = false;
	this.sprite.animations.add('open',[0,1,2,3,4]);
	this.sprite.animations.add('close',[4,3,2,1,0]);
	game.physics.p2.enable(this.sprite);
	this.sprite.body.static = true;
	group.add(this.sprite);
}

function atDoor(player, door, g){
	if(interact){
		console.log(door.name);
		interact = false;
		door.animations.play('open', 8, false);
		var game = g;
		this.frozen = true;
		setTimeout(function() {
			game.load_level(door.name, parseInt(door.dest.x), parseInt(door.dest.y));
		}, 600);
	}
}

function atSideDoor(player, door, game){
	if(interact && !door.open){
		interact = false;
		door.open = true;
		door.animations.play('open', 8, false);
		game.physics.p2.removeBody(door.body);
		var game = this;
	}
	if(interact && door.open){
		interact = false;
		door.open = false;
		door.animations.play('close', 8, false);
		var game = this;
		setTimeout(function() {
			this.game.physics.p2.addBody(door.body);
		}, 600);
	}
}

var play_state = {
	preload: function() {
	    this.game.physics.startSystem(Phaser.Physics.P2JS); 
    	this.game.physics.p2.gravity.y = 1400;  
	},

	create: function() {
		this.wallGroup = this.game.add.group();
		this.doorGroup = this.game.add.group();
		this.sideDoorsGroup = this.game.add.group();
		this.characterGroup = this.game.add.group();

		this.game.stage.smoothed = false;
		this.velocity = 0;
		this.direction = 1;
		this.running = false
		this.attacking = false;
		this.landed = false;

		this.overlayGroup = this.game.add.group();
		this.load_level("house", 400, 900);

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
			this.direction = 1;
			this.character.scale = {x:5,y:5};
			this.running = true;
			if(this.touchingDown(this.character))
			MoveDust(this.game, this.character, this.direction);
		}, this);
		this.left.onDown.add(function() {
			this.direction = -1;
			this.velocity = -1;
			this.character.scale = {x:-5,y:5};
			this.running = true;
			if(this.touchingDown(this.character))
			MoveDust(this.game, this.character, this.direction);
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
			if(this.touchingDown(this.character))
			StopDust(this.game, this.character, this.direction);

		}, this);
		this.left.onUp.add(function() {
			this.running=false;
			if(this.touchingDown(this.character))
			StopDust(this.game, this.character, this.direction);

		}, this);
		this.up.onUp.add(function() {interact=false;}, this);
		this.jumpKey.onUp.add(function() {this.jump=false;}, this);


	},

	update: function() { 
	    if(this.frozen){
	    	this.running = false;
	    	this.jump = false;
	    	this.velocity = 0;
	    }

		for (var i = 0; i < this.doorGroup.children.length; i++) {
 			if(this.character.overlap(this.doorGroup.children[i])){
				atDoor(this.character, this.doorGroup.children[i], this);
			}
		}

		for (var i = 0; i < this.sideDoorsGroup.children.length; i++) {
 			if(this.character.overlap(this.sideDoorsGroup.children[i])){
				atSideDoor(this.character, this.sideDoorsGroup.children[i], this);
			}
		}
		
		if(this.punching && this.punching.isFinished){
			this.attacking = false;
			this.punching = null;
		}

		if(this.velocity <= .1 && this.velocity >= -.1){
			this.velocity = 0;
		}
		
		if (this.jump && this.touchingDown(this.character)) {
			this.character.body.velocity.y = -750;
			JumpDust(this.game, this.character, this.direction);
			this.landed = false;
		}

		if(!this.touchingDown(this.character)){
			this.landed = false;
		}
		
		this.character.body.velocity.x = this.velocity * 170;
		if(this.touchingDown(this.character) && !this.landed && !this.jump){
			LandDust(this.game, this.character, this.direction);
			this.landed = true;
		}
		if(this.running){
			this.character.animations.play('walk', 8, true);
			this.torso.animations.play('walk', 8, true);

		}
		else if(this.velocity > 0 || this.velocity<0){
			this.velocity *= .9;
			this.character.animations.play('stop', 8, false);
			this.torso.animations.play('idle', 8, true);
		}
		
		else if(this.touchingDown(this.character)){
			this.character.animations.play('idle', 8, false);
			if(this.attacking || (this.punching && !this.punching.isFinished)){
				this.punching = this.torso.animations.play('punch', 16, false);
			}
			else{
				this.torso.animations.play('idle', 8, false);
			}
		}
		if (!this.touchingDown(this.character)) {
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
		if(this.level=="houseFront" && this.character.position.x < 0){
			this.load_level("subwayGround", 1240,1000);
		}
		if(this.level=="houseFront" && this.character.position.x >2400){
			this.load_level("park", 20,1000);
		}
		if(this.level=="house" && this.character.position.x > 800){
			this.load_level("houseBack", 400,1000);
		}
		if(this.level=="subwayGround" && this.character.position.x > 1270){
			this.load_level("houseFront", 20,1000);
		}		
		if(this.level=="park" && this.character.position.x < 0){
			this.load_level("houseFront", 2350,1000);
		}
	},

	load_level: function(level, x, y) {
		this.frozen = false;
		this.wallGroup.removeAll();
		this.doorGroup.removeAll();
		this.overlayGroup.removeAll();
		this.sideDoorsGroup.removeAll();
		this.characterGroup.removeAll();

		this.game.physics.p2.clear();

		if(level == "houseFront" || level == "houseBack" || level == "subwayGround" || level == "park"){
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
		this.overlay = this.map.createLayer('overlay',1024,1024,this.overlayGroup);	
		this.dark = this.map.createLayer('bg',1024,1024,this.wallGroup);	
		console.log(this.dark);
		this.dark.alpha = .5;
		this.layer = this.map.createLayer('layer',1024,1024,this.wallGroup);	

		this.layer.resizeWorld();
		this.map.setCollisionBetween(0, 3000, true, "layer", true );

    	this.collisionTiles = this.game.physics.p2.convertTilemap(this.map, this.layer); 
    	if(this.map.objects['slopes']){
	    	this.slopes = this.game.physics.p2.convertCollisionObjects(this.map,"slopes");  
    	}
		
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
		this.character = this.game.add.sprite(0, 0, 'legs');
		this.torso = this.game.add.sprite(0, -5, 'torso');
		this.head = this.game.add.sprite(.5, -9, 'headIdle');
		this.head.smoothed = false;
		this.character.addChild(this.torso);
		this.torso.addChild(this.head);
		this.character.animations.add('walk',[0,1,2,3]);
		this.character.animations.add('stop',[4,5,6,7]);
		this.character.animations.add('jumpUp',[8]);
		this.character.animations.add('jumpForward',[9]);
		this.character.animations.add('idle', [0]);
		this.character.smoothed = false;
		this.torso.animations.add('walk',[0,1,2,3]);
		this.torso.animations.add('idle', [0]);
		this.torso.animations.add('jump',[3]);
		this.torso.animations.add('punch',[4,5,6,7,7,6,5,4]);
		this.torso.smoothed = false;
		this.characterGroup.add(this.character);

		this.game.physics.p2.enable(this.character);
    	this.character.body.x = x;
    	this.character.body.y = y;
		this.torso.body.static = true;
		this.head.body.static = true;

		/*
		this.character.anchor= {x : .5,y: .9};
		this.torso.anchor= {x : .5,y: .775};
		this.head.anchor= {x : .5,y: .6};
		*/
	    this.character.body.setCircle(10,0,0); 
	    //this.character.body.setRectangle(10,80, 10, -30); 
	    //this.character.body.addCapsule(7,7); 
    	this.character.body.fixedRotation=true; 
		this.game.camera.follow(this.character);
		this.character.scale = {x:this.direction * 5,y:5};
    	this.level = level;
    },

//find objects in a Tiled layer that containt a property called "type" equal to a certain value
touchingDown: function(someone) {
    var yAxis = p2.vec2.fromValues(0, 1);
    var result = false;
    for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
        var c = game.physics.p2.world.narrowphase.contactEquations[i];  // cycles through all the contactEquations until it finds our "someone"
        if (c.bodyA === someone.body.data || c.bodyB === someone.body.data)        {
            var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
            if (c.bodyA === someone.body.data) d *= -1;
            if (d > 0.5) result = true;
        }
    } return result;
},

findObjectsByType: function(map, layerName) {
	var result = [];
	map.objects[layerName].forEach(function(element){
		result.push(element);
	});
	return result;
},

die : function() {

},
};