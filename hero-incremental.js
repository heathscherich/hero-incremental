var devmode = 1
var textColor = "black"
class Page {
	constructor() {
		this.buttons = {}
	}

	addButton(name, text, font, color, x, y, action, rectWidth=undefined, rectHeight=undefined, details=undefined) {
		this.buttons[name] = { text: text, font: font, color: color, left: x, top: y, details: details, action: action }
		if(rectWidth != undefined && rectHeight != undefined) {
			this.buttons[name].rectHeight = rectHeight
			this.buttons[name].rectWidth = rectWidth
		}
	}

	removeButton(name) {
		delete this.buttons[name]
	}

	drawButton(name) {
		let buttonProps = this.buttons[name]
		ctx.font = buttonProps.font
		ctx.fillStyle = buttonProps.color
		let height = parseInt(buttonProps.font)
		let width = ctx.measureText(buttonProps.text).width

		if (buttonProps.rectWidth != undefined && buttonProps.rectHeight != undefined) {
			ctx.fillText(buttonProps.text, buttonProps.left + buttonProps.rectWidth/2 - width/2, buttonProps.top + buttonProps.rectHeight/2 + height/3)
		} else {
			ctx.fillText(buttonProps.text, buttonProps.left, buttonProps.top)
		}

		if (buttonProps.rectWidth != undefined && buttonProps.rectHeight != undefined) {
			ctx.strokeStyle = textColor
			ctx.strokeRect(buttonProps.left, buttonProps.top, buttonProps.rectWidth, buttonProps.rectHeight)
		}
	}

	checkForPress(x, y) {
		for(var key in this.buttons) {
			let button = this.buttons[key]
			ctx.font = button.font
			let height = parseInt(button.font)
			let width = ctx.measureText(button.text).width

			if(button.rectWidth != undefined && button.rectHeight != undefined) {
				if(x > button.left && x < button.left + button.rectWidth
					&& y > button.top && y < button.top + button.rectHeight) {
					var item = key.split(" ").splice(1).join(" ")
					button.action(item)
				}
			} else {
				if(x > button.left && x < button.left + width
					&& y > button.top - height && y < button.top) {
					var item = key.split(" ").splice(1).join(" ")
					button.action(item)
				}
			}
		}
	}
}

battle = new Page()
inv = new Page()
buildings = new Page()
stats = new Page()
quests = new Page()
temple = new Page()

pages = {
	battle: battle,
	inv: inv,
	buildings: buildings,
	stats: stats,
	quests: quests,
	temple: temple
}

var currentPage = "battle"

var species_tags = [ "kobold", "beast", "giant", "golem", "demon", "dragon", "temple" ]
var species = {
	"kobold": {
		symbol: "k",
		health: 10,
		attack: 2,
		defence: 5,
		reward: 1
	},
	"beast": {
		symbol: "b",
		health: 40,
		attack: 15,
		defence: 25,
		reward: 5
	},
	"giant": {
		symbol: "gi",
		health: 110,
		attack: 120,
		defence: 80,
		reward: 25
	},
	"golem": {
		symbol: "go",
		health: 400,
		attack: 600,
		defence: 160,
		reward: 50
	},
	"demon": {
		symbol: "de",
		health: 1000,
		attack: 4500,
		defence: 300,
		reward: 100
	},
	"dragon": {
		symbol: "dr",
		health: 4000,
		attack: 10000,
		defence: 600,
		reward: 500
	}
}

var elements_tags = [ "crystal", "stone", "leaf" ]
var elements = {
	"crystal": {
		color: "blue",
		attack: 1.1,
		defence: 1.0,
		health: 1.0
	},
	"stone": {
		color: "brown",
		attack: 1.0,
		defence: 1.1,
		health: 1.0
	},
	"leaf": {
		color: "green",
		attack: 1.0,
		defence: 1.0,
		health: 1.1
	}
}

var weapon_tags = ["shortsword", "shortbow", "staff",
										"longsword", "longbow", "battlestaff",
										"greatsword", "greatbow", "tome"]
var armor_tags = ["leather helm", "leather chaps", "leather torso", "wooden ring",
									"med helm", "chainskirt", "chain torso", "iron ring",
									"full helm", "platelegs", "platebody", "gold ring" ]
var drops = {
	"shortsword": {
		attack: 9.6,
		range: 30,
		cooldown: 2,
		type: "sword"
	},
	"longsword": {
		attack: 110,
		range: 35,
		cooldown: 2,
		type: "sword"
	},
	"greatsword": {
		attack: 1500,
		range: 40,
		cooldown: 2,
		type: "sword"
	},
	"shortbow": {
		attack: 2.5,
		range: 150,
		cooldown: 1,
		type: "bow"
	},
	"longbow": {
		attack: 30,
		range: 200,
		cooldown: 1,
		type: "bow"
	},
	"greatbow": {
		attack: 550,
		range: 300,
		cooldown: 1.5,
		type: "bow"
	},
	"staff": {
		attack: 6.25,
		range: 50,
		cooldown: 1.5,
		type: "magic"
	},
	"battlestaff": {
		attack: 70,
		range: 75,
		cooldown: 1.5,
		type: "magic"
	},
	"tome": {
		attack: 375,
		range: 75,
		cooldown: .75,
		type: "magic"
	},
	"leather helm": {
		defence: 5,
		type: "helmet"
	},
	"med helm": {
		defence: 25,
		type: "helmet"
	},
	"full helm": {
		defence: 75,
		type: "helmet"
	},
	"leather torso": {
		defence: 10,
		type: "torso"
	},
	"chain torso": {
		defence: 35,
		type: "torso"
	},
	"platebody": {
		defence: 90,
		type: "torso"
	},
	"leather chaps": {
		defence: 10,
		type: "legs"
	},
	"chainskirt": {
		defence: 30,
		type: "legs"
	},
	"platelegs": {
		defence: 80,
		type: "legs"
	},
	"wooden ring": {
		range: 100,
		type: "ring"
	},
	"iron ring": {
		type: "ring"
	},
	"gold ring": {
		type: "ring"
	}
}

var user_stats = {
	"startedPlaying": Date.now(),
	"totalElapsedTime": 0,
	"startedTemple": Date.now(),
	"ElapsedTempleTime": 0,
	"fastestTemple": 0
}

var bolts = []

var team = [{
	name: "hero",
	x: 350,
	y: 600,
	experience: 0,
	health: 100,
	baseAttack: 1,
	attack: 1,
	baseDefence: 10,
	defence: 10,
	speed: 2,
	cooldown: Date.now()/1000,
	tempWeapon: "",
	weapon: "hands",
	helmet: "",
	torso: "",
	legs: "",
	rings: []
}]

var inventory = {
	"hands": {
		attack: 2,
		range: 25,
		cooldown: 1,
		type: "sword"
	}
}

var questStore = {
	quest_points: 0,
	"speed": {
		bought: false
	},
	"craftAll": {
		bought: false
	},
	"reset10": {
		bought: false,
		toggled: false
	},
	"meleeSwap": {
		bought: false,
		toggled: false
	}
}

var quests_list = {
	"kobold": {
		"kc": {
			goal: 1000,
			progress: 0,
			reward: 50
		},
		"megas": {
			goal: 10,
			progress: 0,
			reward: 100
		},
		"waves": {
			goal: 10,
			progress: 0,
			reward: 10
		}
	},
	"beast": {
		"kc": {
			goal: 1000,
			progress: 0,
			reward: 200
		},
		"megas": {
			goal: 10,
			progress: 0,
			reward: 400
		},
		"waves": {
			goal: 10,
			progress: 0,
			reward: 100
		}
	},
	"giant": {
		"kc": {
			goal: 1000,
			progress: 0,
			reward: 800
		},
		"megas": {
			goal: 10,
			progress: 0,
			reward: 1500
		},
		"waves": {
			goal: 10,
			progress: 0,
			reward: 400
		}
	},
	"golem": {
		"kc": {
			goal: 1000,
			progress: 0,
			reward: 2500
		},
		"megas": {
			goal: 10,
			progress: 0,
			reward: 3000
		},
		"waves": {
			goal: 10,
			progress: 0,
			reward: 2500
		}
	},
	"demon": {
		"kc": {
			goal: 1000,
			progress: 0,
			reward: 10000
		},
		"megas": {
			goal: 10,
			progress: 0,
			reward: 6000
		},
		"waves": {
			goal: 10,
			progress: 0,
			reward: 10000
		}
	},
	"dragon": {
		"kc": {
			goal: 1000,
			progress: 0,
			reward: 50000
		},
		"megas": {
			goal: 10,
			progress: 0,
			reward: 12000
		},
		"waves": {
			goal: 10,
			progress: 0,
			reward: 50000
		}
	},
	"misc": {
		"time": {
			start: Date.now()/1000,
			lastSaveDate: Date.now()/1000,
			completed: false
		},
		"craft": {
			progress: 0,
			completed: false
		},
		"meteor": {
			progress: 0
		}
	}
}
var original_quests_list = Object.assign({}, quests_list)

var templeRewards = {
	"ring": false,
	"aura": false,
	"wisdom": false
}

var rebirth = {
	"hero": {
		level: 0,
		cost: 50
	},
	"ally": {
		level: 0,
		cost: 200
	},
	"equipment": {
		level: 0,
		cost: 100
	},
	"resource": {
		level: 0,
		cost: 250
	}
}
var rebirth_original = Object.assign({}, rebirth)

var challenges = {
  "1HP": {
    inProgress: false,
    completed: false
  },
  "aggroHero": {
    inProgress: false,
    completed: false
  },
  "noEquipment": {
    inProgress: false,
    completed: false
  }
}

var resources = {
	crystal: 0,
	stone: 0,
	leaf: 0
}

var housing = {
	"kobold": {
		owned: 0,
		filled: 0,
		level: 0
	},
	"beast": {
		owned: 0,
		filled: 0,
		level: 0
	},
	"giant": {
		owned: 0,
		filled: 0,
		level: 0
	},
	"golem": {
		owned: 0,
		filled: 0,
		level: 0
	},
	"demon": {
		owned: 0,
		filled: 0,
		level: 0
	},
	"dragon": {
		owned: 0,
		filled: 0,
		level: 0
	}
}

var support = {
	"meteor": {
		meteors: [],
		level: 0
	},
	"chamber": {
		owned: 0,
		level: 0
	}
}

var structures = {
  "totem": {
    totems: [],
    level: 0
  },
  "hall": {
    halls: [],
    level: 0
  }
}

var buildingsSubmenus = {
	showHouses: false,
	showSupport: false,
  showStructures: false,
	reset: function() {
		this.showHouses = ""
		this.showSupport = ""
    this.showStructures = ""
	}
}

pageLoadChecker = {
	info: false,
	inventory: false,
	buildings: false,
	quests: false,
	stats: false,
	temple: false
}

var enemies = []
var messages = []

var baseBonus = 1
var rebirth_points = 0
var highestStages = [ 1, 0, 0, 0, 0, 0 ]

var currentArea = 1,
	highestArea = 1,
	currentStage = 1

savefile = localStorage.getItem("savefile")
savefile = JSON.parse(savefile)
if(savefile != undefined) {
  challenges = savefile.challenges
	textColor = savefile.textColor
	currentStage = savefile.currentStage
	templeRewards = savefile.templeRewards
	questStore = savefile.questStore
	currentArea = savefile.currentArea
	devmode = savefile.devmode
	housing = savefile.housing
	support = savefile.support
  structures = savefile.structures
	rebirth_points = savefile.rebirth_points
	resources = savefile.resources
	highestStages = savefile.highestStages
	rebirth = savefile.rebirth
	quests_list = savefile.quests_list
	inventory = savefile.inventory
	team = savefile.team

	if(textColor == undefined) {
		textColor = "black"
    document.body.style.backgroundColor = "white"
	} else if(textColor == "white") {
		document.body.style.backgroundColor = "black"
	} else if(textColor == "black") {
    document.body.style.backgroundColor = "white"
  }
  if(challenges == undefined) {
    challenges = {
      "1HP": {
        inProgress: false,
        completed: false
      },
      "aggroHero": {
        inProgress: false,
        completed: false
      },
      "noEquipment": {
        inProgress: false,
        completed: false
      }
    }
  }
  if(structures == undefined) {
    structures = {
      "totem": {
        totems: [],
        level: 0
      },
      "hall": {
        halls: [],
        level: 0
      }
    }
  }
  if(support["chamber"] == undefined) {
    support["chamber"] = {
      owned: 0,
      level: 0,
      radius: 0
    }
  }
  if(inventory["gold ring"]) {
    templeRewards["ring"] = true
  } else {
    templeRewards["ring"] = false
  }
  if(templeRewards["aura"] == undefined) {
    templeRewards["aura"] = false
  }
	if(currentStage == undefined) {
		currentStage = 1
	}


	for(i=0; i<highestStages.length; i++) {
		if(highestStages[i] == 0) {
			highestArea = i
			break
		}
		if(i == highestStages.length - 1) {
			highestArea = i + 1
		}
	}

	if(challenges["noEquipment"].completed) {
		baseBonus = 3

		team[0].attack = (baseBonus - 1)**9 + team[0].baseAttack**baseBonus + Math.sqrt(team[0].experience)/2
		team[0].defence = team[0].baseDefence*baseBonus**3 + Math.sqrt(team[0].experience)
		team[0].speed = 2 + (1.5 + (baseBonus - 1)**2)*(rebirth["hero"].level)
	}
	if(quests_list["misc"]["meteor"].progress >= 4) {
		inventory["iron ring"] = Object.assign({}, drops["iron ring"])
		inventory["iron ring"].owned = 1
		inventory["iron ring"].level = 1
	}
	quests_list["misc"]["time"].start += Date.now()/1000 - quests_list["misc"]["time"].lastSaveDate
}

var then = Date.now(),
	start

function spawnEnemies() {
	enemies = []

	let tot_noobs = Math.ceil(currentStage/3)
	let num_noobs = 0
	let species_index
	let prestige = currentStage - 4 > 1 ? currentStage - 4 : 0
	let mega
	for(i=0; i<currentStage; i++){
		mega = false
		if(num_noobs < tot_noobs && currentStage > 1 && currentArea > 1) {
			species_index = Math.floor((currentArea - 1)*Math.random())
			num_noobs += 1
		} else {
			species_index =  currentArea - 1
		}
		let health = species[species_tags[species_index]].health*1.3**prestige
		if(prestige) {
			let roll = 1000*Math.random()
			if(roll < 10) {
				mega = true
				species_index = currentArea - 1
				health = 10*species[species_tags[species_index]].health*1.3**prestige
			}
		}
		enemies.push({
			species: species_tags[species_index],
			element: elements_tags[Math.floor(3*Math.random())],
			x: 100 + 500*Math.random(),
			y: 100 + 200*Math.random(),
			trajectory: {
				angle: 2*Math.PI*Math.random(),
				turning: 0
			},
			targetid: undefined,
			cooldown: undefined,
			total_health: health,
			health: health,
			prestige: prestige,
			mega: mega
		})
	}
}

function loadArea(area) {
	if(area == 7) {
    for(var i in challenges) {
      if(challenges[i].inProgress) {
        challenges[i].inProgress = false
        challenges[i].completed = true
        if(i == "noEquipment") {
          baseBonus = 3
        }
      }
    }
		currentPage = "temple"
		return
	}
	if(area != currentArea) {
		quests_list["misc"]["time"].start = Date.now()/1000
	}
	currentArea = area
	currentStage = 1
	team[0].health = 100
	team[0].x = 400
	team[0].y = 600

  if(challenges["1HP"].completed) {
    team[0].health *= 10
  }
  if(challenges["1HP"].inProgress) {
    team[0].health = 1
  }

	n = 0
	for(i=1; i<team.length; i++) {
		team[i].x = 400 + 50*Math.cos(n*Math.PI)
		team[i].y = 600 + 25*Math.ceil(n/2)
		team[i].health = species[team[i].name].health * (1.5**rebirth["ally"].level) * (housing[team[i].name].level + 4)/5
	}

	for(i=0; i<structures["totem"].totems.length; i++) {
		let x = 500*Math.random() + 150
		let y = 500*Math.random() + 150

		structures["totem"].totems[i].x = x
		structures["totem"].totems[i].y = y
	}

  for(i=0; i<structures["hall"].halls.length; i++) {
		let x = 500*Math.random() + 150
		let y = 500*Math.random() + 150

		structures["hall"].halls[i].x = x
		structures["hall"].halls[i].y = y
	}

	bolts = []
	enemies.splice(0, enemies.length)
	spawnEnemies()

	quests_list["misc"]["time"].lastSaveDate = Date.now()/1000
	savefile = {
    challenges: challenges,
		textColor: textColor,
		currentStage: currentStage,
		templeRewards: templeRewards,
		questStore: questStore,
		currentArea: currentArea,
		devmode: devmode,
		housing: housing,
		support: support,
    structures: structures,
		rebirth_points: rebirth_points,
		resources: resources,
		highestStages: highestStages,
		rebirth: rebirth,
		quests_list: quests_list,
		inventory: inventory,
		team: team
	}
	localStorage.setItem("savefile", JSON.stringify(savefile))
}

function rebirthResets() {
	if(quests_list["misc"]["time"].completed == false) {
		quests_list["misc"]["time"].start = Date.now()/1000
	}

	for(i=1; i<=highestArea; i++) {
		battle.removeButton("area " + i)
	}
	bolts = []
	highestArea = 1
	currentArea = 1
	currentStage = 1
	highestStages = [ 1, 0, 0, 0, 0, 0 ]
	buildingsSubmenus.reset()

	for(i=0; i<species_tags.length - 1; i++) {
		housing[species_tags[i]].owned = 0
		housing[species_tags[i]].filled = 0
		housing[species_tags[i]].level = 0
	}
	support = {
		"meteor": {
			meteors: [],
			level: 0
		},
		"chamber": {
      owned: 0,
      level: 0,
      radius: 0
    }
	}
  structures = {
    "totem": {
      totems: [],
      level: 0
    },
    "hall": {
      halls: [],
      level: 0
    }
  }

	resources["crystal"] = 0
	resources["stone"] = 0
	resources["leaf"] = 0

	let wr, ir, gr
	if(inventory["wooden ring"]) {
		wr = inventory["wooden ring"]
	}
	if(inventory["iron ring"]) {
		ir = inventory["iron ring"]
	}
	if(inventory["gold ring"]) {
		gr = inventory["gold ring"]
	}

	inventory = {
		"hands": {
			attack: 2,
			range: 25,
			cooldown: 1,
			type: "sword"
		}
	}

	if(wr != undefined) {
		inventory["wooden ring"] = wr
	}
	if(ir != undefined) {
		inventory["iron ring"] = ir
	}
	if(gr != undefined) {
		inventory["gold ring"] = gr
	}

  if(challenges["1HP"].inProgress) {
    let health = 1
  } else if(challenges["1HP"].completed) {
    let health = 1000
  } else {
    let health = 100
  }

	team = [{
		name: "hero",
		x: 350,
		y: 600,
		experience: team[0].experience,
		health: 100,
		baseAttack: team[0].baseAttack,
		attack: team[0].attack,
		baseDefence: team[0].baseDefence,
		defence: team[0].defence,
		speed: team[0].speed,
		cooldown: Date.now()/1000,
		tempWeapon: "",
		weapon: "hands",
		helmet: "",
		torso: "",
		legs: "",
		rings: []
	}]
}

function templeResets() {
	original_quests_list["misc"] = quests_list["misc"]
	quests_list = Object.assign({}, original_quests_list)
	rebirth = Object.assign({}, rebirth_original)
	rebirth_points = 0

	for(i=1; i<=highestArea; i++) {
		battle.removeButton("area " + i)
	}
	bolts = []
	highestArea = 1
	currentArea = 1
	currentStage = 1
	highestStages = [ 1, 0, 0, 0, 0, 0 ]
	buildingsSubmenus.reset()

	for(i=0; i<species_tags.length - 1; i++) {
		housing[species_tags[i]].owned = 0
		housing[species_tags[i]].filled = 0
		housing[species_tags[i]].level = 0
	}
  support = {
		"meteor": {
			meteors: [],
			level: 0
		},
		"chamber": {
      owned: 0,
      level: 0,
      radius: 0
    }
	}
  structures = {
    "totem": {
      totems: [],
      level: 0
    },
    "hall": {
      halls: [],
      level: 0
    }
  }

	resources["crystal"] = 0
	resources["stone"] = 0
	resources["leaf"] = 0

	let wr, ir, gr
	if(inventory["wooden ring"]) {
		wr = inventory["wooden ring"]
	}
	if(inventory["iron ring"]) {
		ir = inventory["iron ring"]
	}
	if(inventory["gold ring"]) {
		gr = inventory["gold ring"]
	}

	inventory = {
		"hands": {
			attack: 2,
			range: 25,
			cooldown: 1,
			type: "sword"
		}
	}

	if(wr != undefined) {
		inventory["wooden ring"] = wr
	}
	if(ir != undefined) {
		inventory["iron ring"] = ir
	}
	if(gr != undefined) {
		inventory["gold ring"] = gr
	}

  if(challenges["1HP"].inProgress) {
    inventory["shortbow"] = Object.assign({}, drops["shortbow"])
    inventory["shortbow"].owned = 1
    inventory["shortbow"].level = 1
  }

  let health
  if(challenges["1HP"].inProgress) {
    health = 1
  } else if(challenges["1HP"].completed) {
    health = 1000
  } else {
    health = 100
  }

	team = [{
		name: "hero",
		x: 350,
		y: 600,
		experience: 0,
		health: health,
		baseAttack: 1,
		attack: (baseBonus - 1)**9 + 1,
		baseDefence: 10,
		defence: 10*baseBonus**3,
		speed: 2,
		cooldown: Date.now()/1000,
		tempWeapon: "",
		weapon: "hands",
		helmet: "",
		torso: "",
		legs: "",
		rings: []
	}]
}

function drawHero(hero) {
	ctx.fillStyle = "red"
	ctx.font = "16px Arial"
	ctx.fillText("H", team[0].x, team[0].y)
}

function drawTeam(team) {
	for(i=1; i<team.length; i++) {
		ctx.fillStyle = "red"
		ctx.font = "16px Arial"
		ctx.fillText(species[team[i].name].symbol, team[i].x, team[i].y)

		if(team[i].health < species[team[i]["name"]].health * (1.5**rebirth["ally"].level) * (housing[team[i].name].level + 4)/5) {
			let width = ctx.measureText(species[team[i]["name"]].symbol).width
			ratio = team[i].health/(species[team[i]["name"]].health * (1.5**rebirth["ally"].level) * (housing[team[i].name].level + 4)/5)
			ctx.fillStyle = textColor
			ctx.strokeRect(team[i].x - 40 + width/2, team[i].y - 30, 80, 8)
			ctx.fillStyle = "blue"
			ctx.fillRect(team[i].x - 40 + width/2, team[i].y - 30, 80*ratio, 8)
		}
	}
}

function drawEnemies(enemies) {
	for(var i=0; i<enemies.length; i++) {
		enemy_element = enemies[i]["element"]
		enemy_species = enemies[i]["species"]
		ctx.fillStyle = elements[enemy_element].color
		if(enemies[i].mega == true) {
			ctx.font = "32px Arial"
		} else {
			ctx.font = "16px Arial"
		}
		ctx.fillText(species[enemy_species].symbol, enemies[i].x, enemies[i].y)

		if(enemies[i].health < enemies[i].total_health) {
			let width = ctx.measureText(species[enemy_species].symbol).width
			ratio = enemies[i].health/enemies[i].total_health
			ctx.fillStyle = "red"
			ctx.fillRect(enemies[i].x - 40 + width/2, enemies[i].y - 30, 80*ratio, 8)
			ctx.strokeRect(enemies[i].x - 40 + width/2, enemies[i].y - 30, 80, 8)
		}
	}
}

function drawInfo() {
	if(!pageLoadChecker.info) {
		for (var i=0; i<highestArea; i++) {
			battle.addButton("area " + (i + 1), species_tags[i], "14px Arial", textColor, 9 + 88*i, 10, function(number) {
				loadArea(number)
			}, 75, 75)
		}

		battle.addButton("inventory", "Inventory", "14px Arial", textColor, 10, 180, function() {
			currentPage = "inv"
		})
		battle.addButton("buildings", "Buildings", "14px Arial", textColor, 10, 200, function() {
			currentPage = "buildings"
		})
		battle.addButton("quests", "Quests", "14px Arial", textColor, 10, 220, function() {
			currentPage = "quests"
		})
		battle.addButton("stats", "Stats", "14px Arial", textColor, 10, 240, function() {
			currentPage = "stats"
		})
	}
	pageLoadChecker.info = true

	for(var i=1; i<=highestArea; i++){
		battle.drawButton("area " + i)
		ctx.font = "14px Arial"
		ctx.fillStyle = textColor
		if(i == currentArea) {
			ctx.fillText("Stage: " + currentStage, 20 + 88*(i-1), 70)
		} else {
			ctx.fillText("Highest: " + highestStages[i-1], 11 + 88*(i-1), 70)
		}
	}

	ctx.fillText("Health " + Math.ceil(team[0].health), 10, 100)
	ctx.fillStyle = "blue"
	ctx.fillText("Crystal " + Math.floor(resources["crystal"]), 10, 120)
	ctx.fillStyle = "brown"
	ctx.fillText("Stone " + Math.floor(resources["stone"]), 10, 140)
	ctx.fillStyle = "green"
	ctx.fillText("Leaf " + Math.floor(resources["leaf"]), 10, 160)
	battle.drawButton("inventory")
	battle.drawButton("buildings")
	battle.drawButton("quests")
	battle.drawButton("stats")

	ctx.font = "10px Arial"
	if(messages.length > 0) {
		for(i=messages.length - 1; i>=0; i--) {
			ctx.fillText(messages[i]["text"], 500, 675-(messages.length-1-i)*10)

			if(Date.now()/1000 > messages[i]["timeout"]) {
				messages.splice(i, 1)
			}
		}
	}
}

function drawInventory() {
	if (!pageLoadChecker.inventory){
		inv["buttons"] = {}
		ctx.clearRect(0, 0, 800, 800)
		inv.addButton("close", "Close Inventory", "14px Arial", textColor, 10, 10, function() {
			currentPage = "battle"
			pageLoadChecker.inventory = false
		})
		inv.drawButton("close")

		if(questStore["craftAll"].bought) {
			inv.addButton("craftAll", "Craft All", "14px Arial", textColor, 10, 27, function() {
				for(var key in inv.buttons) {
					if(key.includes("craft ")) {
						let item = key.split(" ").splice(1).join(" ")
						inv.buttons[key].action(item)
					}
				}
				pageLoadChecker.inventory = false
				drawInventory()
			}, 75, 20)
			inv.drawButton("craftAll")
		}

		ctx.strokeRect(10, 50, 300, 30)
		ctx.font = "16px Arial"
		ctx.fillStyle = textColor
		ctx.fillText("Weapons", 125, 73)
		ctx.strokeRect(10, 390, 400, 30)
		ctx.fillText("Armor", 190, 413)

		inventory_tags = Object.keys(inventory)
		for(i=0; i<9; i++) {
			ctx.strokeRect(10 + 100*(i%3), 80 + 100*Math.floor(i/3), 100, 100)

			if (inventory_tags.includes(weapon_tags[i])) {
				weapon_details = inventory[weapon_tags[i]]
				ctx.font = "16px Arial"
				ctx.fillStyle = textColor
				ctx.fillText(weapon_tags[i], 12 + 100*(i%3), 96 + 100*Math.floor(i/3))
				ctx.font = "12px Arial"
				ctx.fillStyle = textColor
				ctx.fillText("Dps: " + (weapon_details.attack/weapon_details.cooldown).toFixed(2), 12 + 100*(i%3), 110 + 100*Math.floor(i/3))
				ctx.fillText("Attack: " + weapon_details.attack.toFixed(2), 12 + 100*(i%3), 122 + 100*Math.floor(i/3))
				ctx.fillText("Speed: " + (1/weapon_details.cooldown).toFixed(2), 12 + 100*(i%3), 134 + 100*Math.floor(i/3))
				ctx.fillText("Owned: " + weapon_details.owned, 12 + 100*(i%3), 146 + 100*Math.floor(i/3))
				if(team[0].weapon == weapon_tags[i]) {
					inv.addButton("unequip " + weapon_tags[i], "Unequip", "14px Arial", textColor, 12 + 100*(i%3), 176 + 100*Math.floor(i/3), function(item) {
						inv.removeButton("unequip " + item)
						team[0].weapon = "hands"
						team[0].tempWeapon = ""
						pageLoadChecker.inventory = false
						drawInventory()
					})
					inv.drawButton("unequip " + weapon_tags[i])
				} else {
					inv.addButton("equip " + weapon_tags[i], "Equip", "14px Arial", textColor, 12 + 100*(i%3), 176 + 100*Math.floor(i/3), function(item) {
            if(!challenges["noEquipment"].inProgress) {
              inv.removeButton("equip " + item)

  						var i = weapon_tags.indexOf(item)
  						var item_stats = inventory[item]
  						team[0].weapon = item
  						if(questStore["meleeSwap"].toggled && (item_stats.type == "bow" || item_stats.type == "magic")) {
  							if(inventory["greatsword"]) {
  								team[0].tempWeapon = "greatsword"
  							} else if(inventory["longsword"]) {
  								team[0].tempWeapon = "longsword"
  							} else if(inventory["shortsword"]) {
  								team[0].tempWeapon = "shortsword"
  							}
  						}
  						pageLoadChecker.inventory = false
  						drawInventory()
            }
					})
					inv.drawButton("equip " + weapon_tags[i])
				}
				if(inv.buttons["craft " + weapon_tags[i]] == undefined) {
					inv.addButton("craft " + weapon_tags[i], "Craft", "14px Arial", textColor, 76 + 100*(i%3), 176 + 100*Math.floor(i/3), function(item) {
						var i = weapon_tags.indexOf(item)

						if(inventory[item].owned > 1) {
							let craft_bonus

							if(!quests_list["misc"]["craft"].completed) {
								craft_bonus = 1
								quests_list["misc"]["craft"].progress += inventory[item].owned - 1
							}
							if(quests_list["misc"]["craft"].progress >= 10000) {
								craft_bonus = 1.1

								if(!quests_list["misc"]["craft"].completed) {
									quests_list["misc"]["craft"].progress = 10000
									quests_list["misc"]["craft"].completed = true
									messages.push({text: "Quest completed!", timeout: Date.now()/1000 + 3})
									questStore.quest_points += 1
								}
							}
							inventory[item].level += inventory[item].owned - 1
							inventory[item].attack = drops[item].attack*(Math.sqrt(inventory[item].level)/4 + 3/4)*(1.4**rebirth["equipment"].level)*craft_bonus
							let cd = drops[item].cooldown
							inventory[item].cooldown = cd/(inventory[item].level+1)**1.1 + (cd-cd/2**1.1)
							inventory[item].owned = 1
						}
						pageLoadChecker.inventory = false
						drawInventory()
					})
				}
				inv.drawButton("craft " + weapon_tags[i])
			} else {
				ctx.font = "64px Arial"
				ctx.fillStyle = textColor
				ctx.fillText("?", 60 + 100*(i%3) - 16, 130 + 100*Math.floor(i/3) + 24)
			}
		}
		for(i=0; i<12; i++) {
			ctx.strokeRect(10 + 100*(i%4), 420 + 100*Math.floor(i/4), 100, 100)
			if (inventory_tags.includes(armor_tags[i])) {
				armor_details = inventory[armor_tags[i]]
				ctx.font = "16px Arial"
				ctx.fillStyle = textColor
				ctx.fillText(armor_tags[i], 12 + 100*(i%4), 436 + 100*Math.floor(i/4))
				ctx.font = "12px Arial"
				ctx.fillStyle = textColor
				if(armor_tags[i] == "wooden ring") {
					ctx.fillText("Range: " + armor_details.range.toFixed(2), 12 + 100*(i%4), 450 + 100*Math.floor(i/4))
				} else if(armor_tags[i] == "iron ring") {
					ctx.fillText("Attracts meteors", 12 + 100*(i%4), 450 + 100*Math.floor(i/4))
				} else if(armor_tags[i] == "gold ring") {
					ctx.fillText("Doubles loot", 12 + 100*(i%4), 450 + 100*Math.floor(i/4))
				} else {
					ctx.fillText("Defence: " + armor_details.defence.toFixed(2), 12 + 100*(i%4), 450 + 100*Math.floor(i/4))
				}
				ctx.fillText("Owned: " + armor_details.owned, 12 + 100*(i%4), 462 + 100*Math.floor(i/4))

				if(team[0].helmet == armor_tags[i] || team[0].torso == armor_tags[i] || team[0].legs == armor_tags[i] || team[0].rings.includes(armor_tags[i])) {
					inv.addButton("unequip " + armor_tags[i], "Unequip", "14px Arial", textColor, 12 + 100*(i%4), 516 + 100*Math.floor(i/4), function(item) {
						inv.removeButton("unequip " + item)
						var i = armor_tags.indexOf(item)
						var item_stats = inventory[item]
						if (item_stats.type == 'helmet') {
							team[0].helmet = ""
						} else if (item_stats.type == 'torso') {
							team[0].torso = ""
						} else if (item_stats.type == 'legs') {
							team[0].legs = ""
						} else {
							team[0].rings.splice(team[0].rings.indexOf(item), 1)
						}
						pageLoadChecker.inventory = false
						drawInventory()
					})
					inv.drawButton("unequip " + armor_tags[i])
				} else {
					inv.addButton("equip " + armor_tags[i], "Equip", "14px Arial", textColor, 12 + 100*(i%4), 516 + 100*Math.floor(i/4), function(item) {
            if(!challenges["noEquipment"].inProgress) {
              inv.removeButton("equip " + item)

  						var i = armor_tags.indexOf(item)
  						var item_stats = inventory[item]
  						if (item_stats.type == 'helmet') {
  							team[0].helmet = item
  						} else if (item_stats.type == 'torso') {
  							team[0].torso = item
  						} else if (item_stats.type == 'legs'){
  							team[0].legs = item
  						} else {
  							team[0].rings.push(item)
  						}
  						pageLoadChecker.inventory = false
  						drawInventory()
            }
					})
					inv.drawButton("equip " + armor_tags[i])
				}
				if(inv["craft " + armor_tags[i]] == undefined) {
					inv.addButton("craft " + armor_tags[i], "Craft", "14px Arial", textColor, 76 + 100*(i%4), 516 + 100*Math.floor(i/4), function(item) {
						var i = armor_tags.indexOf(item)

						if(inventory[item].owned > 1) {
							let craft_bonus

							if(!quests_list["misc"]["craft"].completed) {
								craft_bonus = 1
								quests_list["misc"]["craft"].progress += inventory[item].owned - 1
							}
							if(quests_list["misc"]["craft"].progress >= 10000) {
								craft_bonus = 1.1

								if(!quests_list["misc"]["craft"].completed) {
									quests_list["misc"]["craft"].progress = 10000
									quests_list["misc"]["craft"].completed = true
									messages.push({text: "Quest completed!", timeout: Date.now()/1000 + 3})
									questStore.quest_points += 1
								}
							}

							inventory[item].level += inventory[item].owned - 1
							if(item == "wooden ring") {
								inventory[item].range = drops[item].range*(Math.sqrt(inventory[item].level)/4 + 3/4)*craft_bonus
							} else {
								inventory[item].defence = drops[item].defence*(Math.sqrt(inventory[item].level)/4 + 3/4)*(1.4**rebirth["equipment"].level)*craft_bonus
							}
							inventory[item].owned = 1
						}

						pageLoadChecker.inventory = false
						drawInventory()
					})
				}
				inv.drawButton("craft " + armor_tags[i])
			} else {
				ctx.font = "64px Arial"
				ctx.fillStyle = textColor
				ctx.fillText("?", 60 + 100*(i%4) - 16, 470 + 100*Math.floor(i/4) + 24)
			}
		}
		pageLoadChecker.inventory = true
	}
}

function drawBuildingsScreen() {
	function removeDetailsButtons() {
		buildings.removeButton("buy hut")
		buildings.removeButton("upgrade hut")
		buildings.removeButton("buy den")
		buildings.removeButton("upgrade den")
		buildings.removeButton("buy cave")
		buildings.removeButton("upgrade cave")
		buildings.removeButton("buy mountain")
		buildings.removeButton("upgrade mountain")
		buildings.removeButton("buy pit")
		buildings.removeButton("upgrade pit")
		buildings.removeButton("buy nest")
		buildings.removeButton("upgrade nest")
		buildings.removeButton("buy meteor")
		buildings.removeButton("upgrade meteor")
    buildings.removeButton("buy chamber")
    buildings.removeButton("upgrade chamber")
		buildings.removeButton("buy totem")
		buildings.removeButton("upgrade totem")
    buildings.removeButton("buy hall")
    buildings.removeButton("upgrade hall")
	}
	function showBuildingDetails(building) {
		removeDetailsButtons()
		if(building == "hut") {
			ctx.strokeRect(170, 50, 350, 200)
			ctx.font = "24px Arial"
			ctx.fillStyle = textColor
			ctx.fillText("Hut", 190, 75)
			ctx.font = "16px Arial"
			ctx.fillText("Chance to recruit a Kobold", 240, 75)
			ctx.fillText("Owned: " + housing["kobold"].owned, 190, 95)
			ctx.fillText("Level: " + housing["kobold"].level, 190, 115)

			buildings.addButton("buy hut", "Buy", "14px Arial", textColor, 205, 185, function() {
				if(resources["stone"] >= 10**(housing["kobold"].owned + 1)) {
					resources["stone"] -= 10**(housing["kobold"].owned + 1)
					housing["kobold"].owned += 1

					pageLoadChecker.buildings = false
					drawBuildingsScreen()
				}
			}, 75, 20)
			buildings.drawButton("buy hut")
			ctx.font = "14px Arial"
			ctx.fillText(10**(housing["kobold"].owned + 1) + " Stone", 205, 218)
			if(housing["kobold"].owned > 0) {
				buildings.addButton("upgrade hut", "Upgrade", "14px Arial", textColor, 320, 185, function() {
					if(resources["stone"] >= Math.ceil(10 * (housing["kobold"].level + 1)**1.5)) {
						resources["stone"] -= Math.ceil(10 * (housing["kobold"].level + 1)**1.5)
						housing["kobold"].level += 1

						pageLoadChecker.buildings = false
						drawBuildingsScreen()
					}
				}, 75, 20)
				buildings.drawButton("upgrade hut")
				ctx.font = "14px Arial"
				ctx.fillText(Math.ceil(10 * (housing["kobold"].level + 1)**1.5) + " Stone", 320, 218)
			}
		} else if(building == "den") {
			ctx.strokeRect(170, 50, 350, 200)
			ctx.font = "24px Arial"
			ctx.fillStyle = textColor
			ctx.fillText("Den", 190, 75)
			ctx.font = "16px Arial"
			ctx.fillText("Chance to recruit a Beast", 245, 75)
			ctx.fillText("Owned: " + housing["beast"].owned, 190, 95)
			ctx.fillText("Level: " + housing["beast"].level, 190, 115)

			buildings.addButton("buy den", "Buy", "14px Arial", textColor, 205, 185, function() {
				if(resources["stone"] >= 10**(housing["beast"].owned + 2)) {
					resources["stone"] -= 10**(housing["beast"].owned + 2)
					housing["beast"].owned += 1

					pageLoadChecker.buildings = false
					drawBuildingsScreen()
				}
			}, 75, 20)
			ctx.font = "14px Arial"
			buildings.drawButton("buy den")
			ctx.fillText(10**(housing["beast"].owned + 2) + " Stone", 205, 218)

			if(housing["beast"].owned > 0) {
				buildings.addButton("upgrade den", "Upgrade", "14px Arial", textColor, 320, 185, function() {
					if(resources["stone"] >= Math.ceil(100 * (housing["beast"].level + 1)**1.5)) {
						resources["stone"] -= Math.ceil(100 * (housing["beast"].level + 1)**1.5)
						housing["beast"].level += 1

						pageLoadChecker.buildings = false
						drawBuildingsScreen()
					}
				}, 75, 20)
				buildings.drawButton("upgrade den")
				ctx.font = "14px Arial"
				ctx.fillText(Math.ceil(100 * (housing["beast"].level + 1)**1.5) + " Stone", 320, 218)
			}
		} else if(building == "cave") {
			ctx.strokeRect(170, 50, 350, 200)
			ctx.font = "24px Arial"
			ctx.fillStyle = textColor
			ctx.fillText("Cave", 190, 75)
			ctx.font = "16px Arial"
			ctx.fillText("Chance to recruit a Giant", 260, 75)
			ctx.fillText("Owned: " + housing["giant"].owned, 190, 95)
			ctx.fillText("Level: " + housing["giant"].level, 190, 115)

			buildings.addButton("buy cave", "Buy", "14px Arial", textColor, 205, 185, function() {
				if(resources["stone"] >= 10**(housing["giant"].owned + 3)) {
					resources["stone"] -= 10**(housing["giant"].owned + 3)
					housing["giant"].owned += 1

					pageLoadChecker.buildings = false
					drawBuildingsScreen()
				}
			}, 75, 20)
			buildings.drawButton("buy cave")
			ctx.font = "14px Arial"
			ctx.fillText(10**(housing["giant"].owned + 3) + " Stone", 205, 218)

			if(housing["giant"].owned > 0) {
				buildings.addButton("upgrade cave", "Upgrade", "14px Arial", textColor, 320, 185, function() {
					if(resources["stone"] >= Math.ceil(1000 * (housing["giant"].level + 1)**1.5)) {
						resources["stone"] -= Math.ceil(1000 * (housing["giant"].level + 1)**1.5)
						housing["giant"].level += 1

						pageLoadChecker.buildings = false
						drawBuildingsScreen()
					}
				}, 75, 20)
				buildings.drawButton("upgrade cave")
				ctx.font = "14px Arial"
				ctx.fillText(Math.ceil(1000 * (housing["giant"].level + 1)**1.5) + " Stone", 320, 218)
			}
		} else if(building == "mountain") {
			ctx.strokeRect(170, 50, 350, 200)
			ctx.font = "24px Arial"
			ctx.fillStyle = textColor
			ctx.fillText("Mountain", 190, 75)
			ctx.font = "16px Arial"
			ctx.fillText("Chance to recruit a Golem", 300, 75)
			ctx.fillText("Owned: " + housing["golem"].owned, 190, 95)
			ctx.fillText("Level: " + housing["golem"].level, 190, 115)

			buildings.addButton("buy mountain", "Buy", "14px Arial", textColor, 205, 185, function() {
				if(resources["stone"] >= 10**(housing["golem"].owned + 4)) {
					resources["stone"] -= 10**(housing["golem"].owned + 4)
					housing["golem"].owned += 1

					pageLoadChecker.buildings = false
					drawBuildingsScreen()
				}
			}, 75, 20)
			buildings.drawButton("buy mountain")
			ctx.font = "14px Arial"
			ctx.fillText(10**(housing["golem"].owned + 4) + " Stone", 205, 218)
			if(housing["golem"].owned > 0) {
				buildings.addButton("upgrade mountain", "Upgrade", "14px Arial", textColor, 320, 185, function() {
					if(resources["stone"] >= Math.ceil(10000 * (housing["golem"].level + 1)**1.5)) {
						resources["stone"] -= Math.ceil(10000 * (housing["golem"].level + 1)**1.5)
						housing["golem"].level += 1

						pageLoadChecker.buildings = false
						drawBuildingsScreen()
					}
				}, 75, 20)
				buildings.drawButton("upgrade mountain")
				ctx.font = "14px Arial"
				ctx.fillText(Math.ceil(10000 * (housing["golem"].level + 1)**1.5) + " Stone", 320, 218)
			}
		} else if(building == "pit") {
			ctx.strokeRect(170, 50, 350, 200)
			ctx.font = "24px Arial"
			ctx.fillStyle = textColor
			ctx.fillText("Pit", 190, 75)
			ctx.font = "16px Arial"
			ctx.fillText("Chance to recruit a Demon", 228, 75)
			ctx.fillText("Owned: " + housing["demon"].owned, 190, 95)
			ctx.fillText("Level: " + housing["demon"].level, 190, 115)

			buildings.addButton("buy pit", "Buy", "14px Arial", textColor, 205, 185, function() {
				if(resources["stone"] >= 10**(housing["demon"].owned + 5)) {
					resources["stone"] -= 10**(housing["demon"].owned + 5)
					housing["demon"].owned += 1

					pageLoadChecker.buildings = false
					drawBuildingsScreen()
				}
			}, 75, 20)
			buildings.drawButton("buy pit")
			ctx.font = "14px Arial"
			ctx.fillText(10**(housing["demon"].owned + 5) + " Stone", 205, 218)
			if(housing["demon"].owned > 0) {
				buildings.addButton("upgrade pit", "Upgrade", "14px Arial", textColor, 320, 185, function() {
					if(resources["stone"] >= Math.ceil(100000 * (housing["demon"].level + 1)**1.5)) {
						resources["stone"] -= Math.ceil(100000 * (housing["demon"].level + 1)**1.5)
						housing["demon"].level += 1

						pageLoadChecker.buildings = false
						drawBuildingsScreen()
					}
				}, 75, 20)
				buildings.drawButton("upgrade pit")
				ctx.font = "14px Arial"
				ctx.fillText(Math.ceil(100000 * (housing["demon"].level + 1)**1.5) + " Stone", 320, 218)
			}
		} else if(building == "nest") {
			ctx.strokeRect(170, 50, 350, 200)
			ctx.font = "24px Arial"
			ctx.fillStyle = textColor
			ctx.fillText("Nest", 190, 75)
			ctx.font = "16px Arial"
			ctx.fillText("Chance to recruit a Dragon", 300, 75)
			ctx.fillText("Owned: " + housing["dragon"].owned, 190, 95)
			ctx.fillText("Level: " + housing["dragon"].level, 190, 115)

			buildings.addButton("buy nest", "Buy", "14px Arial", textColor, 205, 185, function() {
				if(resources["stone"] >= 10**(housing["dragon"].owned + 6)) {
					resources["stone"] -= 10**(housing["dragon"].owned + 6)
					housing["dragon"].owned += 1

					pageLoadChecker.buildings = false
					drawBuildingsScreen()
				}
			}, 75, 20)
			buildings.drawButton("buy nest")
			ctx.font = "14px Arial"
			ctx.fillText(10**(housing["dragon"].owned + 6) + " Stone", 205, 218)
			if(housing["dragon"].owned > 0) {
				buildings.addButton("upgrade nest", "Upgrade", "14px Arial", textColor, 320, 185, function() {
					if(resources["stone"] >= Math.ceil(1000000 * (housing["dragon"].level + 1)**1.5)) {
						resources["stone"] -= Math.ceil(1000000 * (housing["dragon"].level + 1)**1.5)
						housing["dragon"].level += 1

						pageLoadChecker.buildings = false
						drawBuildingsScreen()
					}
				}, 75, 20)
				buildings.drawButton("upgrade nest")
				ctx.font = "14px Arial"
				ctx.fillText(Math.ceil(1000000 * (housing["dragon"].level + 1)**1.5) + " Stone", 320, 218)
			}
		} else if(building == "meteor") {
			ctx.strokeRect(200, 50, 350, 200)
			ctx.font = "24px Arial"
			ctx.fillStyle = textColor
			ctx.fillText("Mage Tower", 220, 75)
			ctx.font = "16px Arial"
			ctx.fillText("Summons meteors", 360, 75)
			ctx.fillText("Owned: " + support["meteor"].meteors.length, 220, 95)
			ctx.fillText("Level: " + support["meteor"].level, 220, 115)

			buildings.addButton("buy meteor", "Buy", "14px Arial", textColor, 235, 185, function() {
				if(resources["crystal"] >= 5*10**(support["meteor"].meteors.length + 1)) {
					resources["crystal"] -= 5*10**(support["meteor"].meteors.length + 1)
					support["meteor"].meteors.push({
						cooldown: Date.now()/1000 + 10*Math.random()/devmode,
						radius: 0
					})

					pageLoadChecker.buildings = false
					drawBuildingsScreen()
				}
			}, 75, 20)
			buildings.drawButton("buy meteor")
			ctx.font = "14px Arial"
			ctx.fillText(5*10**(support["meteor"].meteors.length + 1) + " Crystal", 235, 218)

			if(support["meteor"].meteors.length > 0) {
				buildings.addButton("upgrade meteor", "Upgrade", "14px Arial", textColor, 350, 185, function() {
					if(resources["crystal"] >= 250 * 2**support["meteor"].level) {
						resources["crystal"] -= 250 * 2**support["meteor"].level
						support["meteor"].level += 1

						pageLoadChecker.buildings = false
						drawBuildingsScreen()
					}
				}, 75, 20)
				buildings.drawButton("upgrade meteor")
				ctx.font = "14px Arial"
				ctx.fillText(250 * 2**support["meteor"].level + " Crystal", 350, 218)
			}
		} else if(building == "totem") {
			ctx.strokeRect(200, 50, 350, 200)
			ctx.font = "24px Arial"
			ctx.fillStyle = textColor
			ctx.fillText("Speed Totem", 220, 75)
			ctx.font = "16px Arial"
			ctx.fillText("Increases movement", 370, 75)
			ctx.fillText("and attack speed", 370, 90)
			ctx.fillText("Owned: " + structures["totem"].totems.length, 220, 95)
			ctx.fillText("Level: " + structures["totem"].level, 220, 115)

			buildings.addButton("buy totem", "Buy", "14px Arial", textColor, 235, 185, function() {
				if(resources["leaf"] >= 2*10**(structures["totem"].totems.length + 1)) {
					resources["leaf"] -= 2*10**(structures["totem"].totems.length + 1)
					structures["totem"].totems.push({
						x: 500*Math.random() + 150,
						y: 500*Math.random() + 150
					})

					pageLoadChecker.buildings = false
					drawBuildingsScreen()
				}
			}, 75, 20)
			buildings.drawButton("buy totem")
			ctx.font = "14px Arial"
			ctx.fillText(2*10**(structures["totem"].totems.length + 1) + " Leaf", 235, 218)

			if(structures["totem"].totems.length > 0) {
				buildings.addButton("upgrade totem", "Upgrade", "14px Arial", textColor, 350, 185, function() {
					if(resources["leaf"] >= 400 * 2**structures["totem"].level) {
						resources["leaf"] -= 400 * 2**structures["totem"].level
						structures["totem"].level += 1

						pageLoadChecker.buildings = false
						drawBuildingsScreen()
					}
				}, 75, 20)
				buildings.drawButton("upgrade totem")
				ctx.font = "14px Arial"
				ctx.fillText(400 * 2**structures["totem"].level + " Leaf", 350, 218)
			}
		} else if(building == "chamber") {
			ctx.strokeRect(200, 50, 350, 200)
			ctx.font = "24px Arial"
			ctx.fillStyle = textColor
			ctx.fillText("Time Chamber", 220, 75)
			ctx.font = "16px Arial"
			ctx.fillText("Generates a widening", 387, 75)
      ctx.fillText("field, slowing enemies", 387, 90)
			ctx.fillText("Owned: " + support["chamber"].owned, 220, 95)
			ctx.fillText("Level: " + support["chamber"].level, 220, 115)

			buildings.addButton("buy chamber", "Buy", "14px Arial", textColor, 235, 185, function() {
				if(resources["crystal"] >= 8*10**(support["chamber"].owned + 2) && resources["leaf"] >= 8*10**(support["chamber"].owned + 2)) {
					resources["crystal"] -= 8*10**(support["chamber"].owned + 2)
          resources["leaf"] -= 8*10**(support["chamber"].owned + 2)
          support["chamber"].owned += 1

					pageLoadChecker.buildings = false
					drawBuildingsScreen()
				}
			}, 75, 20)
			buildings.drawButton("buy chamber")
			ctx.font = "14px Arial"
			ctx.fillText(8*10**(support["chamber"].owned + 2) + " Crystal", 235, 218)
			ctx.fillText(8*10**(support["chamber"].owned + 2) + " Leaf", 235, 232)

			if(support["chamber"].owned > 0) {
				buildings.addButton("upgrade chamber", "Upgrade", "14px Arial", textColor, 350, 185, function() {
					if(resources["crystal"] >= 1000 * 2**(support["chamber"].level + 2) && resources["leaf"] >= 1000 * 2**(support["chamber"].level + 2)) {
						resources["crystal"] -= 1000 * 2**(support["chamber"].level + 2)
            resources["leaf"] -= 1000 * 2**(support["chamber"].level + 2)
						support["chamber"].level += 1

						pageLoadChecker.buildings = false
						drawBuildingsScreen()
					}
				}, 75, 20)
				buildings.drawButton("upgrade chamber")
				ctx.font = "14px Arial"
				ctx.fillText(1000 * 2**(support["chamber"].level + 2) + " Crystal", 350, 218)
				ctx.fillText(1000 * 2**(support["chamber"].level + 2) + " Leaf", 350, 232)
			}
		} else if(building == "hall") {
			ctx.strokeRect(200, 50, 350, 200)
			ctx.font = "24px Arial"
			ctx.fillStyle = textColor
			ctx.fillText("Mess Hall", 220, 75)
			ctx.font = "16px Arial"
			ctx.fillText("Heals allies", 335, 75)
			ctx.fillText("Owned: " + structures["hall"].halls.length, 220, 95)
			ctx.fillText("Level: " + structures["hall"].level, 220, 115)

			buildings.addButton("buy hall", "Buy", "14px Arial", textColor, 235, 185, function() {
				if(resources["crystal"] >= 2*10**(structures["hall"].halls.length + 3) && resources["stone"] >= 2*10**(structures["hall"].halls.length + 3)) {
					resources["crystal"] -= 2*10**(structures["hall"].halls.length + 3)
          resources["stone"] -= 2*10**(structures["hall"].halls.length + 3)
					structures["hall"].halls.push({
						x: 500*Math.random() + 150,
						y: 500*Math.random() + 150
					})

					pageLoadChecker.buildings = false
					drawBuildingsScreen()
				}
			}, 75, 20)
			buildings.drawButton("buy hall")
			ctx.font = "14px Arial"
			ctx.fillText(2*10**(structures["hall"].halls.length + 3) + " Crystal", 235, 218)
      ctx.fillText(2*10**(structures["hall"].halls.length + 3) + " Stone", 235, 230)

			if(structures["hall"].halls.length > 0) {
				buildings.addButton("upgrade hall", "Upgrade", "14px Arial", textColor, 350, 185, function() {
					if(resources["crystal"] >= 1000 * 2**(structures["hall"].level + 2) && resources["stone"] >= 1000 * 2**(structures["hall"].level + 2)) {
						resources["crystal"] -= 1000 * 2**(structures["hall"].level + 2)
            resources["stone"] -= 1000 * 2**(structures["hall"].level + 2)
						structures["hall"].level += 1

						pageLoadChecker.buildings = false
						drawBuildingsScreen()
					}
				}, 75, 20)
				buildings.drawButton("upgrade hall")
				ctx.font = "14px Arial"
				ctx.fillText(1000 * 2**(structures["hall"].level + 2) + " Crystal", 350, 218)
				ctx.fillText(1000 * 2**(structures["hall"].level + 2) + " Stone", 350, 230)
			}
		}
	}

	if(!pageLoadChecker.buildings) {
		ctx.clearRect(0, 0, 800, 800)
		ctx.font = "14px Arial"
		ctx.fillStyle = textColor
		buildings.addButton("close", "Close Buildings", "14px Arial", textColor, 10, 10, function() {
			currentPage = "battle"
			pageLoadChecker.buildings = false
		})
		buildings.drawButton("close")
		ctx.fillText("Crystal: " + Math.floor(resources["crystal"]) + " Stone: " + Math.floor(resources["stone"]) + " Leaf: " + Math.floor(resources["leaf"]), 10, 25)

		ctx.strokeRect(10, 50, 75, 200)
		ctx.font = "16px Arial"
		ctx.fillStyle = textColor
		buildings.addButton("houses", "Houses", "16px Arial", textColor, 10, 50, function() {
			removeDetailsButtons()
			buildingsSubmenus.reset()
			buildingsSubmenus.showHouses = true
			pageLoadChecker.buildings = false
			drawBuildingsScreen()
		}, 75, 30)
		buildings.addButton("support", "Support", "16px Arial", textColor, 10, 80, function() {
			removeDetailsButtons()
			buildingsSubmenus.reset()
			buildingsSubmenus.showSupport = true
			pageLoadChecker.buildings = false
			drawBuildingsScreen()
		}, 75, 30)
    buildings.addButton("structures", "Structures", "16px Arial", textColor, 10, 110, function() {
      removeDetailsButtons()
			buildingsSubmenus.reset()
			buildingsSubmenus.showStructures = true
			pageLoadChecker.buildings = false
			drawBuildingsScreen()
    }, 75, 30)
		buildings.drawButton("houses")
		ctx.beginPath()
		ctx.moveTo(10, 80)
		ctx.lineTo(85, 80)
		ctx.stroke()
		buildings.drawButton("support")
		ctx.moveTo(10, 110)
		ctx.lineTo(85, 110)
		ctx.stroke()
		buildings.drawButton("structures")
		ctx.moveTo(10, 140)
		ctx.lineTo(85, 140)
		ctx.stroke()

		if(buildingsSubmenus.showHouses) {
      buildings.removeButton("meteor")
			buildings.removeButton("chamber")
      buildings.removeButton("totem")
			buildings.removeButton("hall")
			showBuildingDetails(buildingsSubmenus.showHouses)
		} else if(buildingsSubmenus.showSupport) {
      buildings.removeButton("hut")
			buildings.removeButton("den")
			buildings.removeButton("cave")
			buildings.removeButton("mountain")
			buildings.removeButton("pit")
			buildings.removeButton("nest")
      buildings.removeButton("totem")
			buildings.removeButton("hall")
			showBuildingDetails(buildingsSubmenus.showSupport)
		} else if(buildingsSubmenus.showStructures) {
      buildings.removeButton("hut")
			buildings.removeButton("den")
			buildings.removeButton("cave")
			buildings.removeButton("mountain")
			buildings.removeButton("pit")
			buildings.removeButton("nest")
      buildings.removeButton("meteor")
			buildings.removeButton("chamber")
      showBuildingDetails(buildingsSubmenus.showStructures)
    }

		if(buildingsSubmenus.showHouses) {
			buildings.addButton("hut", "Hut", "16px Arial", textColor, 85, 50, function() {
				ctx.clearRect(0, 0, 800, 800)
				pageLoadChecker.buildings = false
				buildingsSubmenus.showHouses = "hut"
				drawBuildingsScreen()
			}, 85, 30)
			if(highestArea >= 2) {
				buildings.addButton("den", "Den", "16px Arial", textColor, 85, 80, function() {
					ctx.clearRect(0, 0, 800, 800)
					pageLoadChecker.buildings = false
					buildingsSubmenus.showHouses = "den"
					drawBuildingsScreen()
				}, 85, 30)
			}
			if(highestArea >= 3) {
				buildings.addButton("cave", "Cave", "16px Arial", textColor, 85, 110, function() {
					ctx.clearRect(0, 0, 800, 800)
					pageLoadChecker.buildings = false
					buildingsSubmenus.showHouses = "cave"
					drawBuildingsScreen()
				}, 85, 30)
			}
			if(highestArea >= 4) {
				buildings.addButton("mountain", "Mountain", "16px Arial", textColor, 85, 140, function() {
					ctx.clearRect(0, 0, 800, 800)
					pageLoadChecker.buildings = false
					buildingsSubmenus.showHouses = "mountain"
					drawBuildingsScreen()
				}, 85, 30)
			}
			if(highestArea >= 5) {
				buildings.addButton("pit", "Pit", "16px Arial", textColor, 85, 170, function() {
					ctx.clearRect(0, 0, 800, 800)
					pageLoadChecker.buildings = false
					buildingsSubmenus.showHouses = "pit"
					drawBuildingsScreen()
				}, 85, 30)
			}
			if(highestArea >= 6) {
				buildings.addButton("nest", "Nest", "16px Arial", textColor, 85, 200, function() {
					ctx.clearRect(0, 0, 800, 800)
					pageLoadChecker.buildings = false
					buildingsSubmenus.showHouses = "nest"
					drawBuildingsScreen()
				}, 85, 30)
			}
			ctx.strokeRect(85, 50, 85, 200)
			buildings.drawButton("hut")
			ctx.beginPath()
			ctx.moveTo(85, 80)
			ctx.lineTo(170, 80)
			ctx.stroke()
			if (highestArea >= 2) {
				buildings.drawButton("den")
				ctx.beginPath()
				ctx.moveTo(85, 110)
				ctx.lineTo(170, 110)
				ctx.stroke()
			}
			if (highestArea >= 3) {
				buildings.drawButton("cave")
				ctx.beginPath()
				ctx.moveTo(85, 140)
				ctx.lineTo(170, 140)
				ctx.stroke()
			}
			if (highestArea >= 4) {
				buildings.drawButton("mountain")
				ctx.beginPath()
				ctx.moveTo(85, 170)
				ctx.lineTo(170, 170)
				ctx.stroke()
			}
			if (highestArea >= 5) {
				buildings.drawButton("pit")
				ctx.beginPath()
				ctx.moveTo(85, 200)
				ctx.lineTo(170, 200)
				ctx.stroke()
			}
			if (highestArea >= 6) {
				buildings.drawButton("nest")
				ctx.beginPath()
				ctx.moveTo(85, 230)
				ctx.lineTo(170, 230)
				ctx.stroke()
			}
		} else if(buildingsSubmenus.showSupport) {
			buildings.addButton("meteor", "Mage Tower", "16px Arial", textColor, 85, 50, function() {
				ctx.clearRect(0, 0, 800, 800)
				pageLoadChecker.buildings = false
				buildingsSubmenus.showSupport = "meteor"
				showBuildingDetails("meteor")
			}, 115, 30)
			ctx.strokeRect(85, 50, 115, 200)
			buildings.drawButton("meteor")
			ctx.beginPath()
			ctx.moveTo(80, 80)
			ctx.lineTo(200, 80)
			ctx.stroke()

      if(highestArea >= 3) {
        buildings.addButton("chamber", "Time Chamber", "16px Arial", textColor, 85, 80, function() {
          ctx.clearRect(0, 0, 800, 800)
          pageLoadChecker.buildings = false
          buildingsSubmenus.showSupport = "chamber"
          showBuildingDetails("chamber")
        }, 115, 30)
        ctx.strokeRect(85, 50, 115, 200)
        buildings.drawButton("chamber")
      }
		} else if(buildingsSubmenus.showStructures) {
      buildings.addButton("totem", "Speed Totem", "16px Arial", textColor, 85, 50, function() {
				ctx.clearRect(0, 0, 800, 800)
				pageLoadChecker.buildings = false
				buildingsSubmenus.showStructures = "totem"
				showBuildingDetails("totem")
			}, 115, 30)
			ctx.strokeRect(85, 50, 115, 200)
      buildings.drawButton("totem")

      if(highestArea >= 3) {
        buildings.addButton("hall", "Mess Hall", "16px Arial", textColor, 85, 80, function() {
          ctx.clearRect(0, 0, 800, 800)
          pageLoadChecker.buildings = false
          buildingsSubmenus.showStructures = "hall"
          showBuildingDetails("hall")
        }, 115, 30)
        buildings.drawButton("hall")
      }
    }
	}
	pageLoadChecker.buildings = true
}

function drawQuests() {
	ctx.clearRect(0, 0, 800, 800)
	if(!pageLoadChecker.quests) {
		quests.addButton("close", "Close Quests", "14px Arial", textColor, 10, 10, function() {
			currentPage = "battle"
			pageLoadChecker.quests = false
		})
		quests.addButton("buy speed", "10 Points", "14px Arial", textColor, 370, 356, function() {
			if(questStore.quest_points >= 10 && devmode < 5) {
				quests.removeButton("buy speed")
				questStore.quest_points -= 10
				questStore["speed"].bought = true
				devmode *= 1.1
				pageLoadChecker.quests = false
				drawQuests()
			}
		}, 75, 18)
		if(!questStore["craftAll"].bought) {
			quests.addButton("buy craftAll", "3 Points", "14px Arial", textColor, 370, 376, function() {
				if(questStore.quest_points >= 3) {
					quests.removeButton("buy craftAll")
					questStore.quest_points -= 3
					questStore["craftAll"].bought = true
					pageLoadChecker.quests = false
					drawQuests()
				}
			}, 75, 18)
		}
		if(!questStore["reset10"].bought) {
			quests.addButton("buy reset10", "6 Points", "14px Arial", textColor, 370, 396, function() {
				if(questStore.quest_points >= 6) {
					quests.removeButton("buy reset10")
					questStore.quest_points -= 6
					questStore["reset10"].bought = true
					pageLoadChecker.quests = false
					drawQuests()
				}
			}, 75, 18)
		}
		if(!questStore["meleeSwap"].bought) {
			quests.addButton("buy meleeSwap", "5 Points", "14px Arial", textColor, 370, 416, function() {
				if(questStore.quest_points >= 5) {
					quests.removeButton("buy meleeSwap")
					questStore.quest_points -= 5
					questStore["meleeSwap"].bought = true
					pageLoadChecker.quests = false
					drawQuests()
				}
			}, 75, 18)
		}

		if(questStore["reset10"].bought) {
			let x
			if(questStore["reset10"].toggled) {
				x = "x"
			} else {
				x = "  "
			}
			quests.addButton("toggle reset10", x, "14px Arial", textColor, 599, 398, function() {
				questStore["reset10"].toggled = !questStore["reset10"].toggled
				pageLoadChecker.quests = false
				drawQuests()
			}, 14, 14)
		}
		if(questStore["meleeSwap"].bought) {
			let x
			if(questStore["meleeSwap"].toggled) {
				x = "x"
			} else {
				x = "  "
			}
			quests.addButton("toggle meleeSwap", x, "14px Arial", textColor, 622, 418, function() {
				questStore["meleeSwap"].toggled = !questStore["meleeSwap"].toggled
				if(questStore["meleeSwap"].toggled && (inventory[team[0].weapon].type == "bow" || inventory[team[0].weapon].type == "magic")) {
					if(inventory["greatsword"]) {
						team[0].tempWeapon = "greatsword"
					} else if(inventory["longsword"]) {
						team[0].tempWeapon = "longsword"
					} else if(inventory["shortsword"]) {
						team[0].tempWeapon = "shortsword"
					}
				} else if(!questStore["meleeSwap"].toggled && team[0].tempWeapon) {
					if (inventory[team[0].tempWeapon].type == "bow" || inventory[team[0].tempWeapon].type == "magic") {
						team[0].weapon = team[0].tempWeapon
						team[0].tempWeapon = ""
					} else if(inventory[team[0].tempWeapon].type == "sword"){
						team[0].tempWeapon = ""
					}
				}
				pageLoadChecker.quests = false
				drawQuests()
			}, 14, 14)
		}
	}
	quests.drawButton("close")

	ctx.font = "16px Arial"
	ctx.fillStyle = textColor
	ctx.fillText("Kobold", 10, 50)
	ctx.beginPath()
	ctx.moveTo(10, 52)
	ctx.lineTo(245, 52)
	ctx.stroke()
	ctx.font = "14px Arial"
	ctx.fillText("- Kill " + quests_list["kobold"]["kc"].goal + " Kobolds (Progress " + quests_list["kobold"]["kc"].progress + ")", 10, 70)
	ctx.fillText("Reward: " + quests_list["kobold"]["kc"].reward + " Rebirth Points", 20, 90)
	ctx.fillText("- Kill " + quests_list["kobold"]["megas"].goal + " Mega Kobolds (Progress " + quests_list["kobold"]["megas"].progress + ")", 10, 110)
	ctx.fillText("Reward: " + quests_list["kobold"]["megas"].reward + " Rebirth Points", 20, 130)
	ctx.fillText("- Reach wave " + quests_list["kobold"]["waves"].goal + " (Progress " + quests_list["kobold"]["waves"].progress + ")", 10, 150)
	ctx.fillText("Reward: " + quests_list["kobold"]["waves"].reward + " Rebirth Points", 20, 170)

	if(highestArea >= 2) {
		ctx.font = "16px Arial"
		ctx.fillStyle = textColor
		ctx.fillText("Beast", 260, 50)
		ctx.beginPath()
		ctx.moveTo(260, 52)
		ctx.lineTo(495, 52)
		ctx.stroke()
		ctx.font = "14px Arial"
		ctx.fillText("- Kill " + quests_list["beast"]["kc"].goal + " Beasts (Progress " + quests_list["beast"]["kc"].progress + ")", 260, 70)
		ctx.fillText("Reward: " + quests_list["beast"]["kc"].reward + " Rebirth Points", 270, 90)
		ctx.fillText("- Kill " + quests_list["beast"]["megas"].goal + " Mega Beasts (Progress " + quests_list["beast"]["megas"].progress + ")", 260, 110)
		ctx.fillText("Reward: " + quests_list["beast"]["megas"].reward + " Rebirth Points", 270, 130)
		ctx.fillText("- Reach wave " + quests_list["beast"]["waves"].goal + " (Progress " + quests_list["beast"]["waves"].progress + ")", 260, 150)
		ctx.fillText("Reward: " + quests_list["beast"]["waves"].reward + " Rebirth Points", 270, 170)
	}
	if(highestArea >= 3) {
		ctx.font = "16px Arial"
		ctx.fillStyle = textColor
		ctx.fillText("Giant", 510, 50)
		ctx.beginPath()
		ctx.moveTo(510, 52)
		ctx.lineTo(745, 52)
		ctx.stroke()
		ctx.font = "14px Arial"
		ctx.fillText("- Kill " + quests_list["giant"]["kc"].goal + " Giants (Progress " + quests_list["giant"]["kc"].progress + ")", 510, 70)
		ctx.fillText("Reward: " + quests_list["giant"]["kc"].reward + " Rebirth Points", 520, 90)
		ctx.fillText("- Kill " + quests_list["giant"]["megas"].goal + " Mega Giants (Progress " + quests_list["giant"]["megas"].progress + ")", 510, 110)
		ctx.fillText("Reward: " + quests_list["giant"]["megas"].reward + " Rebirth Points", 520, 130)
		ctx.fillText("- Reach wave " + quests_list["giant"]["waves"].goal + " (Progress " + quests_list["giant"]["waves"].progress + ")", 510, 150)
		ctx.fillText("Reward: " + quests_list["giant"]["waves"].reward + " Rebirth Points", 520, 170)
	}
	if(highestArea >= 4) {
		ctx.font = "16px Arial"
		ctx.fillStyle = textColor
		ctx.fillText("Golem", 10, 200)
		ctx.beginPath()
		ctx.moveTo(10, 202)
		ctx.lineTo(245, 202)
		ctx.stroke()
		ctx.font = "14px Arial"
		ctx.fillText("- Kill " + quests_list["golem"]["kc"].goal + " Golems (Progress " + quests_list["golem"]["kc"].progress + ")", 10, 220)
		ctx.fillText("Reward: " + quests_list["golem"]["kc"].reward + " Rebirth Points", 20, 240)
		ctx.fillText("- Kill " + quests_list["golem"]["megas"].goal + " Mega Golems (Progress " + quests_list["golem"]["megas"].progress + ")", 10, 260)
		ctx.fillText("Reward: " + quests_list["golem"]["megas"].reward + " Rebirth Points", 20, 280)
		ctx.fillText("- Reach wave " + quests_list["golem"]["waves"].goal + " (Progress " + quests_list["golem"]["waves"].progress + ")", 10, 300)
		ctx.fillText("Reward: " + quests_list["golem"]["waves"].reward + " Rebirth Points", 20, 320)
	}
	if(highestArea >= 5) {
		ctx.font = "16px Arial"
		ctx.fillStyle = textColor
		ctx.fillText("Demon", 260, 200)
		ctx.beginPath()
		ctx.moveTo(260, 202)
		ctx.lineTo(495, 202)
		ctx.stroke()
		ctx.font = "14px Arial"
		ctx.fillText("- Kill " + quests_list["demon"]["kc"].goal + " Demons (Progress " + quests_list["demon"]["kc"].progress + ")", 260, 220)
		ctx.fillText("Reward: " + quests_list["demon"]["kc"].reward + " Rebirth Points", 270, 240)
		ctx.fillText("- Kill " + quests_list["demon"]["megas"].goal + " Mega Demons (Progress " + quests_list["demon"]["megas"].progress + ")", 260, 260)
		ctx.fillText("Reward: " + quests_list["demon"]["megas"].reward + " Rebirth Points", 270, 280)
		ctx.fillText("- Reach wave " + quests_list["demon"]["waves"].goal + " (Progress " + quests_list["demon"]["waves"].progress + ")", 260, 300)
		ctx.fillText("Reward: " + quests_list["demon"]["waves"].reward + " Rebirth Points", 270, 320)
	}
	if(highestArea >= 6) {
		ctx.font = "16px Arial"
		ctx.fillStyle = textColor
		ctx.fillText("Dragon", 510, 200)
		ctx.beginPath()
		ctx.moveTo(510, 202)
		ctx.lineTo(745, 202)
		ctx.stroke()
		ctx.font = "14px Arial"
		ctx.fillText("- Kill " + quests_list["dragon"]["kc"].goal + " Dragons (Progress " + quests_list["dragon"]["kc"].progress + ")", 510, 220)
		ctx.fillText("Reward: " + quests_list["dragon"]["kc"].reward + " Rebirth Points", 520, 240)
		ctx.fillText("- Kill " + quests_list["dragon"]["megas"].goal + " Mega Dragons (Progress " + quests_list["dragon"]["megas"].progress + ")", 510, 260)
		ctx.fillText("Reward: " + quests_list["dragon"]["megas"].reward + " Rebirth Points", 520, 280)
		ctx.fillText("- Reach wave " + quests_list["dragon"]["waves"].goal + " (Progress " + quests_list["dragon"]["waves"].progress + ")", 510, 300)
		ctx.fillText("Reward: " + quests_list["dragon"]["waves"].reward + " Rebirth Points", 520, 320)
	}
	ctx.font = "16px Arial"
	ctx.fillStyle = textColor
	ctx.fillText("Misc", 10, 350)
	ctx.beginPath()
	ctx.moveTo(10, 352)
	ctx.lineTo(245, 352)
	ctx.stroke()
	ctx.font = "14px Arial"
	ctx.fillText("Reward: 1.25x game speed", 20, 470)
	ctx.fillText("- Craft 10,000 items (Progress " + quests_list["misc"]["craft"].progress + ")", 10, 370)
	ctx.fillText("Reward: 10% crafting effectiveness", 20, 390)
	ctx.fillText("- Kill 4 enemies with a single meteor (Progress " + quests_list["misc"]["meteor"].progress + ")", 10, 410)
	ctx.fillText("Reward: Iron ring", 20, 430)
	let delta, hr, min, sec
	if(!quests_list["misc"]["time"].completed) {
		delta = Math.abs(Date.now()/1000 - quests_list["misc"]["time"].start)
		hr = Math.floor((Date.now()/1000 - quests_list["misc"]["time"].start)/3600)
		min = Math.floor((delta - hr*3600)/60)
		sec = Math.round(delta - hr*3600 - min*60)
	} else {
		hr = 12
		min = 0
		sec = 0
	}
	ctx.font = "14px Arial"
	ctx.fillText("- Stay in an area for 12 hours (Progress " + hr + "h" + min + "m" + sec + "s)", 10, 450)

	ctx.font = "16px Arial"
	ctx.fillStyle = textColor
	ctx.fillText("Quest Points: " + questStore.quest_points, 375, 350)
	ctx.beginPath()
	ctx.moveTo(375, 352)
	ctx.lineTo(610, 352)
	ctx.stroke()
	ctx.font = "14px Arial"
	quests.drawButton("buy speed")
	ctx.fillText("Additional 1.1x game speed", 450, 370)
	if(questStore["craftAll"].bought) {
	 ctx.strokeRect(370, 377, 75, 18)
	 ctx.font = "14px Arial"
	 ctx.fillStyle = textColor
	 ctx.fillText("Bought!", 382, 390)
	} else {
	 quests.drawButton("buy craftAll")
	}
	ctx.fillText("Craft all button", 450, 390)
	if(questStore["reset10"].bought) {
	 ctx.strokeRect(370, 397, 75, 18)
	 ctx.font = "14px Arial"
	 ctx.fillStyle = textColor
	 ctx.fillText("Bought!", 382, 410)

	 quests.drawButton("toggle reset10")
	} else {
	 quests.drawButton("buy reset10")
	}
	ctx.fillText("Reset area at Stage 10", 450, 410)
	if(questStore["meleeSwap"].bought) {
	 ctx.strokeRect(370, 417, 75, 18)
	 ctx.font = "14px Arial"
	 ctx.fillStyle = textColor
	 ctx.fillText("Bought!", 382, 430)

	 quests.drawButton("toggle meleeSwap")
	} else {
	 quests.drawButton("buy meleeSwap")
	}
	ctx.fillText("Melee swap when in range", 450, 430)

	pageLoadChecker.quests = true
}

function drawStats() {
	if (!pageLoadChecker.stats) {
		ctx.clearRect(0, 0, 800, 800)
		stats.addButton("close", "Close Stats", "14px Arial", textColor, 10, 10, function() {
			currentPage = "battle"
			pageLoadChecker.stats = false
		})
		stats.drawButton("close")

		ctx.font = "16px Arial"
		ctx.fillStyle = textColor
		ctx.fillText("Attack: " + team[0].attack.toFixed(1), 10, 50)
		ctx.fillText("Defence: " + team[0].defence.toFixed(1), 10, 70)
		ctx.fillText("Speed: " + team[0].speed, 10, 90)
		if(templeRewards["wisdom"]) {
			ctx.fillText("Experience: " + team[0].experience, 10, 110)
		}

		stats.addButton("hero+", "+", "16px Arial", textColor, 10, 170, function() {
			if(rebirth_points >= rebirth["hero"].cost && rebirth["hero"].level < 3) {
				rebirth_points -= rebirth["hero"].cost
				rebirth["hero"].cost = 3*rebirth["hero"].cost
				rebirth["hero"].level += 1

				if(rebirth["hero"].level >= 3) {
					rebirth["hero"].cost = "MAX"
				}

				team[0].baseAttack += 2*rebirth["hero"].level
				team[0].attack = team[0].baseAttack**baseBonus + Math.sqrt(team[0].experience)/2
				team[0].baseDefence += 15*rebirth["hero"].level
				team[0].defence = team[0].baseDefence*baseBonus**3 + Math.sqrt(team[0].experience)
				team[0].speed = 2 + (1.5 + (baseBonus - 1)**2)*rebirth["hero"].level

				rebirthResets()
				spawnEnemies()

				pageLoadChecker.stats = false
				drawStats()
			}
		})
		stats.drawButton("hero+")
		stats.addButton("ally+", "+", "16px Arial", textColor, 10, 190, function() {
			if(rebirth_points >= rebirth["ally"].cost) {
				rebirth_points -= rebirth["ally"].cost
				rebirth["ally"].cost = 2*rebirth["ally"].cost
				rebirth["ally"].level += 1

				rebirthResets()
				spawnEnemies()

				pageLoadChecker.stats = false
				drawStats()
			}
		})
		stats.drawButton("ally+")
		stats.addButton("equipment+", "+", "16px Arial", textColor, 10, 210, function() {
			if(rebirth_points >= rebirth["equipment"].cost) {
				rebirth_points -= rebirth["equipment"].cost
				rebirth["equipment"].cost = 2*rebirth["equipment"].cost
				rebirth["equipment"].level += 1

				rebirthResets()
				spawnEnemies()

				pageLoadChecker.stats = false
				drawStats()
			}
		})
		stats.drawButton("equipment+")
		stats.addButton("resource+", "+", "16px Arial", textColor, 10, 230, function() {
			if(rebirth_points >= rebirth["resource"].cost) {
				rebirth_points -= rebirth["resource"].cost
				rebirth["resource"].cost = 2*rebirth["resource"].cost
				rebirth["resource"].level += 1

				rebirthResets()
				spawnEnemies()

				pageLoadChecker.stats = false
				drawStats()
			}
		})
		stats.drawButton("resource+")
		ctx.fillText("Rebirth Points: " + rebirth_points, 10, 150)
		ctx.fillText("Hero Level: " + rebirth["hero"].level + " Cost: " + rebirth["hero"].cost, 26, 170)
		ctx.fillText("Ally Level: " + rebirth["ally"].level + " Cost: " + rebirth["ally"].cost, 26, 190)
		ctx.fillText("Equipment Level: " + rebirth["equipment"].level + " Cost: " + rebirth["equipment"].cost, 26, 210)
		ctx.fillText("Resource Level: " + rebirth["resource"].level + " Cost: " + rebirth["resource"].cost, 26, 230)

		stats.addButton("manualsave", "Save", "16px Arial", textColor, 10, 270, function() {
			quests_list["misc"]["time"].lastSaveDate = Date.now()/1000
			savefile = {
        challenges: challenges,
				textColor: textColor,
				currentStage: currentStage,
				templeRewards: templeRewards,
				questStore: questStore,
				currentArea: currentArea,
				devmode: devmode,
				housing: housing,
				support: support,
        structures: structures,
				rebirth_points: rebirth_points,
				resources: resources,
				highestStages: highestStages,
				rebirth: rebirth,
				quests_list: quests_list,
				inventory: inventory,
				team: team
			}
			localStorage.setItem("savefile", JSON.stringify(savefile))
		}, 75, 25)
		stats.addButton("exportsave", "Export", "16px Arial", textColor, 95, 270, function() {
			let sf = btoa(JSON.stringify(savefile))
			var file = new Blob([sf], {type: "text/plain"})
			var elm = document.createElement("a")
			var url = URL.createObjectURL(file)
			elm.href = url
			let date = (new Date()).toLocaleDateString().split("/")
			let filename = "Hero_Incremental_" + date[0] + "_" + date[1] + "_" + date[2]
			elm.download = filename
			document.body.appendChild(elm)
			elm.click()
			setTimeout(function() {
				document.body.removeChild(elm)
				window.URL.revokeObjectURL(url)
			}, 0)
		}, 75, 25)
		stats.addButton("importsave", "Import", "16px Arial", textColor, 180, 270, function() {
			function readFile(e) {
				file = e.target.files[0]
				if (!file) {
					return
				}
				var reader = new FileReader()
				reader.onload = function(e) {
					var sf = e.target.result
					sf = atob(sf)
					localStorage.setItem("savefile", sf)
					sf = JSON.parse(sf)
					if(sf != undefined) {
            challenges = sf.challenges
						textColor = sf.textColor
						currentStage = sf.currentStage
						templeRewards = sf.templeRewards
						questStore = sf.questStore
						currentArea = sf.currentArea
						devmode = sf.devmode
						housing = sf.housing
						support = sf.support
            structures = sf.structures
						rebirth_points = sf.rebirth_points
						resources = sf.resources
						highestStages = sf.highestStages
						rebirth = sf.rebirth
						quests_list = sf.quests_list
						inventory = sf.inventory
						team = sf.team

						if(textColor == undefined) {
							textColor = "black"
              document.body.style.backgroundColor = "white"
						} else if(textColor == "white") {
							document.body.style.backgroundColor = "black"
						} else if(textColor == "black") {
              document.body.style.backgroundColor = "white"
            }
            if(challenges == undefined) {
              challenges = {
                "1HP": {
                  inProgress: false,
                  completed: false
                },
                "aggroHero": {
                  inProgress: false,
                  completed: false
                },
                "noEquipment": {
                  inProgress: false,
                  completed: false
                }
              }
            }
            if(structures == undefined) {
              structures = {
                "totem": {
                  totems: [],
                  level: 0
                },
                "hall": {
                  halls: [],
                  level: 0
                }
              }
            }
            if(support["chamber"] == undefined) {
              support["chamber"] = {
                owned: 0,
                level: 0,
                radius: 0
              }
            }
            if(inventory["gold ring"]) {
              templeRewards["ring"] = true
            } else {
              templeRewards["ring"] = false
            }
            if(templeRewards["aura"] == undefined) {
              templeRewards["aura"] = false
            }
            if(challenges["noEquipment"].completed) {
          		baseBonus = 3

          		team[0].attack = (baseBonus - 1)**9 + team[0].baseAttack**baseBonus + Math.sqrt(team[0].experience)/2
          		team[0].defence = team[0].baseDefence*baseBonus**3 + Math.sqrt(team[0].experience)
          		team[0].speed = 2 + (1.5 + (baseBonus - 1)**2)*(rebirth["hero"].level)
          	}
						if(currentStage == undefined) {
							currentStage = 1
						}

						for(i=0; i<highestStages.length; i++) {
							if(highestStages[i] == 0) {
								highestArea = i
								break
							}
							if(i == highestStages.length - 1) {
								highestArea = i + 1
							}
						}

						if(quests_list["misc"]["meteor"].progress >= 4) {
							inventory["iron ring"] = Object.assign({}, drops["iron ring"])
							inventory["iron ring"].owned = 1
							inventory["iron ring"].level = 1
						}
						quests_list["misc"]["time"].start += Date.now()/1000 - quests_list["misc"]["time"].lastSaveDate
					}
					document.body.removeChild(elm)
				}
				reader.readAsText(file)
			}
			var elm = document.createElement("input")
			elm.type = "file"
			elm.addEventListener("change", readFile)
			document.body.appendChild(elm)
			elm.click()
		}, 75, 25)
		stats.drawButton("manualsave")
		stats.drawButton("importsave")
		stats.drawButton("exportsave")

		stats.addButton("darkmode", "Invert Colors", "14px Arial", textColor, 10, 305, function() {
			if(textColor == "black") {
				textColor = "white"
				document.body.style.backgroundColor = "black"
			} else if(textColor == "white") {
				textColor = "black"
				document.body.style.backgroundColor = "white"
			}
			pageLoadChecker.stats = false
			drawStats()
		}, 95, 25)
		stats.drawButton("darkmode")

    var currentChallenge = false
    for(var i in challenges) {
      if(challenges[i].inProgress) {
        currentChallenge = i
      }
    }
    if(currentChallenge) {
      stats.addButton("quit", "End Challenge", "14px Arial", textColor, 10, 250, function() {
        challenges[currentChallenge].inProgress = false
      })
      stats.drawButton("quit")
    }
	}
	pageLoadChecker.stats = true
}

function drawTemple() {
	if (!pageLoadChecker.temple) {
		ctx.clearRect(0, 0, 800, 800)

		temple.addButton("close", "Close Temple", "14px Arial", textColor, 10, 10, function() {
			currentPage = "battle"
			pageLoadChecker.temple = false
		})
		temple.drawButton("close")

		temple.addButton("ring", "Pillar: Gold Ring", "14px Arial", textColor, 10, 70, function() {
			if(!templeRewards["ring"]) {
				inventory["gold ring"] = Object.assign({}, drops["gold ring"])
				inventory["gold ring"].owned = 1
				inventory["gold ring"].level = 1
				templeRewards["ring"] = true

				templeResets()
				spawnEnemies()
				currentPage = "battle"
			}
		}, 150, 40)
		temple.addButton("aura", "Pillar: Warrior Aura", "14px Arial", textColor, 200, 70, function() {
			if(!templeRewards["aura"]) {
				templeRewards["aura"] = true

				templeResets()
				spawnEnemies()
				currentPage = "battle"
			}
		}, 150, 40)
		temple.addButton("wisdom", "Pillar: Heroic Wisdom", "14px Arial", textColor, 390, 70, function() {
			if(!templeRewards["wisdom"]) {
				templeRewards["wisdom"] = true

				templeResets()
				spawnEnemies()
				currentPage = "battle"
			}
		}, 150, 40)

		ctx.fillText("Choose wisely..", 10, 50)
		temple.drawButton("ring")
		temple.drawButton("aura")
		temple.drawButton("wisdom")

    if(!(templeRewards["ring"] && templeRewards["aura"] && templeRewards["wisdom"])) {
      ctx.font = "16px Arial"
  		ctx.fillStyle = textColor
  		ctx.fillText("Challenges: LOCKED", 10, 150)
    } else {
      temple.addButton("1HP", "Glass Cannon", "14px Arial", textColor, 10, 180, function() {
        if(!challenges["1HP"].completed) {
          challenges["1HP"].inProgress = true

          templeResets()
          spawnEnemies()
          currentPage = "battle"
        }
      }, 150, 40)
      temple.addButton("aggroHero", "Aggro Hero", "14px Arial", textColor, 200, 180, function() {
        if(!challenges["aggroHero"].completed) {
          challenges["aggroHero"].inProgress = true

          templeResets()
          spawnEnemies()
          currentPage = "battle"
        }
      }, 150, 40)
      temple.addButton("noEquipment", "Punches", "14px Arial", textColor, 390, 180, function() {
        if(!challenges["noEquipment"].completed) {
          challenges["noEquipment"].inProgress = true

          templeResets()
          spawnEnemies()
          currentPage = "battle"
        }
      }, 150, 40)
      ctx.font = "16px Arial"
  		ctx.fillStyle = textColor
  		ctx.fillText("Challenges: ", 10, 150)
      temple.drawButton("1HP")
      temple.drawButton("aggroHero")
      temple.drawButton("noEquipment")
    }
	}
}

function drawBolt() {
	ctx.font = "16px Arial"
	symbol = ""
	if(inventory[team[0].weapon].type == "bow"){
		ctx.fillStyle = textColor
		symbol = "|"
	} else if(inventory[team[0].weapon].type == "magic"){
		ctx.fillStyle = "red"
		symbol = "o"
	} else {
		bolts = []
	}
	for (i=0; i<bolts.length; i++) {
		ctx.fillText(symbol, bolts[i].x, bolts[i].y)
	}
}

function drawTotems() {
	for(i=0; i<structures["totem"].totems.length; i++) {
		ctx.font = "16px Arial"
		ctx.fillStyle = "green"
		ctx.fillText("\\|/", structures["totem"].totems[i].x, structures["totem"].totems[i].y - 8)
		ctx.fillText("/|\\", structures["totem"].totems[i].x, structures["totem"].totems[i].y + 8)
	}
}

function drawMessHalls() {
  for(i=0; i<structures["hall"].halls.length; i++) {
		ctx.font = "16px Arial"
		ctx.fillStyle = "brown"
    ctx.fillText("  __  ", structures["hall"].halls[i].x - 6, structures["hall"].halls[i].y - 24)
		ctx.fillText("_/ _ \\_", structures["hall"].halls[i].x - 10, structures["hall"].halls[i].y - 8)
		ctx.fillText("|| || ||", structures["hall"].halls[i].x - 5, structures["hall"].halls[i].y + 8)
	}
}

function spawnMeteor(x, y, radius) {
	ctx.font = radius + "px Courier New"
	ctx.fillStyle = "red"
	ctx.fillText('o', x, y)
}

var main = function() {
	function createCanvas() {
		if(currentPage == "inv"){
			pageLoadChecker.info = false
			drawInventory()
		} else if(currentPage == "buildings") {
			pageLoadChecker.info = false
			drawBuildingsScreen()
		} else if(currentPage == "stats") {
			pageLoadChecker.info = false
			drawStats()
		} else if(currentPage == "quests") {
			pageLoadChecker.info = false
			drawQuests()
		} else if(currentPage == "temple") {
			pageLoadChecker.info = false
			drawTemple()
		} else {
			ctx.clearRect(0, 0, 800, 800)
			drawInfo()
			drawHero(team[0])
			drawTeam(team)
			drawEnemies(enemies)
			drawTotems()
      drawMessHalls()
			if(bolts.length){
				drawBolt()
			}
		}
	}

	function update(time) {
		if(quests_list["misc"]["time"].completed != true) {
			if(Date.now()/1000 > quests_list["misc"]["time"].start + 43200) {
				quests_list["misc"]["time"].completed = true
				devmode *= 1.25
				messages.push({text: "Quest completed!", timeout: Date.now()/1000 + 3})
				questStore.quest_points += 1
			}
		}
		for(i=0; i<support["meteor"].meteors.length; i++) {
			if(support["meteor"].meteors[i].cooldown < Date.now()/1000) {
				if(support["meteor"].meteors[i].radius == 0) {
					support["meteor"].meteors[i].radius = 64
					support["meteor"].meteors[i].x = 600*Math.random() + 100
					support["meteor"].meteors[i].y = 400*Math.random()

					if(team[0].rings.includes("iron ring")) {
						let xdif = support["meteor"].meteors[i].x - team[0].x
						let ydif = support["meteor"].meteors[i].y - team[0].y
						angle = Math.atan2(ydif, xdif)

						support["meteor"].meteors[i].x -= 100*Math.cos(angle)
						support["meteor"].meteors[i].y -= 100*Math.sin(angle)
					}
				} else if(support["meteor"].meteors[i].radius > 128){
					support["meteor"].meteors[i].radius = 0
					support["meteor"].meteors[i].cooldown = Date.now()/1000 + 10*Math.random()/devmode
					var deaths = []
					for(j=0; j<enemies.length; j++) {
						if(enemies[j].x < support["meteor"].meteors[i].x + 128/4 && enemies[j].x > support["meteor"].meteors[i].x - 128/4
							&& enemies[j].y < support["meteor"].meteors[i].y + 128/4 && enemies[j].y > support["meteor"].meteors[i].y - 128/4) {
							enemies[j].health -= 8*1.65**support["meteor"].level + 25*support["meteor"].level

							if(enemies[j].health <= 0) {
								deaths.push(j)
							}
						}
					}
					if(deaths.length > quests_list["misc"]["meteor"].progress) {
						quests_list["misc"]["meteor"].progress = deaths.length
						if(deaths.length >= 4 && !inventory["iron ring"]) {
							inventory["iron ring"] = Object.assign({}, drops["iron ring"])
							inventory["iron ring"].owned = 1
							inventory["iron ring"].level = 1
							messages.push({text: "Quest completed!", timeout: Date.now()/1000 + 3})
							questStore.quest_points += 1
						}
					}
					for(j=0; j<deaths.length; j++) {
						deaths.sort((a, b) => b - a)
						handleDeath(deaths[j])
					}
				} else {
					let me = support["meteor"].meteors[i]
					spawnMeteor(me.x - me.radius/3, me.y + me.radius/3, me.radius)
					support["meteor"].meteors[i].radius += 16
				}
			}
		}

		function handleDeath(closest_enemy) {
			for(i=0; i<bolts.length; i++) {
				if(closest_enemy == bolts[i].targetid) {
					bolts = []
				} else if(closest_enemy < bolts[i].targetid) {
					bolts[i].targetid -= 1
				}
			}
			let mega_multiplier = 1
			if(enemies[closest_enemy].mega == true) {
				mega_multiplier = 100
			}
      let loot_multiplier = 1
      if(team[0].rings.includes("gold ring")) {
        loot_multiplier = 2
      }
			let reward = species[enemies[closest_enemy].species].reward
			if(enemies[closest_enemy].element == "crystal") {
				resources["crystal"] += loot_multiplier*mega_multiplier*reward*(2**rebirth["resource"].level)
			} else if(enemies[closest_enemy].element == "stone") {
				resources["stone"] += loot_multiplier*mega_multiplier*reward*(2**rebirth["resource"].level)
			} else if(enemies[closest_enemy].element == "leaf") {
				resources["leaf"] += loot_multiplier*mega_multiplier*reward*(2**rebirth["resource"].level)
			}
			if(templeRewards["wisdom"]) {
				team[0].experience += reward
				team[0].attack = (baseBonus - 1)**9 + team[0].baseAttack**baseBonus + Math.sqrt(team[0].experience)/2
				team[0].defence = team[0].baseDefence*baseBonus**3 + Math.sqrt(team[0].experience)
			}

			let roll = 1000*Math.random()
			let index = species_tags.indexOf(enemies[closest_enemy].species)
			let name = species_tags[index]
			if(enemies[closest_enemy].mega == true) {
				quests_list[name]["megas"].progress += 1

				if(quests_list[name]["megas"].progress >= quests_list[name]["megas"].goal) {
					rebirth_points += quests_list[name]["megas"].reward
					quests_list[name]["megas"].goal *= 5
					quests_list[name]["megas"].reward *= 2
					messages.push({text: "Quest completed!", timeout: Date.now()/1000 + 3})
					questStore.quest_points += 1
				}
			}

			quests_list[name]["kc"].progress += 1
			if(quests_list[name]["kc"].progress >= quests_list[name]["kc"].goal) {
				rebirth_points += quests_list[name]["kc"].reward
				quests_list[name]["kc"].goal *= 5
				quests_list[name]["kc"].reward *= 2
				messages.push({text: "Quest completed!", timeout: Date.now()/1000 + 3})
				questStore.quest_points += 1
			}

			if (housing[name].filled < housing[name].owned && roll < 550 - index*100 + 50*rebirth["ally"].level + 50*housing[name].owned) {
				housing[name].filled += 1
				messages.push({text: "A " + name + " joined you", timeout: Date.now()/1000 + 3})
				team.push({name: name,
										health: species[name].health * (1.5**rebirth["ally"].level) * (housing[name].level + 4)/5,
										defence: species[name].defence,
										cooldown: Date.now()/1000,
                    full: false,
										x: enemies[closest_enemy].x,
										y: enemies[closest_enemy].y})
			}
			let droproll = 1000*Math.random()
      if(enemies[closest_enemy].mega == true) {
        droproll -= 50
      }
			let item_dropped = ""
			if(droproll < 50 + (currentArea - 5)*50 && currentArea >= 5) {
				roll = Math.floor(6*Math.random())
				if(roll == 0) {
					item_dropped = "greatsword"
				} else if(roll == 1) {
					item_dropped = "greatbow"
				} else if(roll == 2){
					item_dropped = "tome"
				} else if(roll == 3) {
					item_dropped = "full helm"
				} else if(roll == 4) {
					item_dropped = "platebody"
				} else if(roll == 5){
					item_dropped = "platelegs"
				}
			} else if(droproll < 150 + (currentArea - 3)*50 && currentArea >= 3) {
				roll = Math.floor(6*Math.random())
				if(roll == 0) {
					item_dropped = "longsword"
				} else if(roll == 1) {
					item_dropped = "longbow"
				} else if(roll == 2){
					item_dropped = "battlestaff"
				} else if(roll == 3) {
					item_dropped = "med helm"
				} else if(roll == 4) {
					item_dropped = "chain torso"
				} else if(roll == 5) {
					item_dropped = "chainskirt"
				}
			}  else if(droproll < 350 && currentArea >= 1) {
				roll = Math.floor(6*Math.random())
				if(roll == 0) {
					item_dropped = "shortsword"
				} else if(roll == 1) {
					item_dropped = "shortbow"
				} else if(roll == 2){
					item_dropped = "staff"
				} else if(roll == 3) {
					item_dropped = "leather helm"
				} else if(roll == 4) {
					item_dropped = "leather torso"
				} else if(roll == 5) {
					item_dropped = "leather chaps"
				}
			}
			if(enemies[closest_enemy].mega) {
        let droproll = 1000*Math.random()
				if(droproll < 25) {
					item_dropped = "wooden ring"
				}
			}
			if (item_dropped.length) {
        let loot_amount = 1
        if(team[0].rings.includes("gold ring")) {
          loot_amount = 2
        }

				var keys = Object.keys(inventory)
				if(!keys.includes(item_dropped)) {
					inventory[item_dropped] = Object.assign({}, drops[item_dropped])
					inventory[item_dropped].owned = loot_multiplier
					inventory[item_dropped].level = 1

					if(inventory[item_dropped].type == "sword" || inventory[item_dropped].type == "magic" || inventory[item_dropped].type == "bow") {
						inventory[item_dropped].attack = inventory[item_dropped].attack*(1.4**rebirth["equipment"].level)

						if(questStore["meleeSwap"].toggled && inventory[item_dropped].type == "sword" && team[0].weapon != "hands") {
							if(team[0].tempWeapon == "") {
								team[0].tempWeapon = item_dropped
							}
							let new_index = weapon_tags.indexOf(item_dropped)
							if(inventory[team[0].tempWeapon].type == "sword") {
								let old_index = weapon_tags.indexOf(team[0].tempWeapon)
								if(new_index > old_index) {
									team[0].tempWeapon = item_dropped
								}
							} else {
								let old_index = weapon_tags.indexOf(team[0].weapon)
								if(new_index > old_index) {
									team[0].weapon = item_dropped
								}
							}
						}
					} else if(inventory[item_dropped].type == "helmet" || inventory[item_dropped].type == "torso" || inventory[item_dropped].type == "legs"){
						inventory[item_dropped].defence = inventory[item_dropped].defence*(1.4**rebirth["equipment"].level)
					} else if(inventory[item_dropped] == "wooden ring") {
						inventory[item_dropped].range = inventory[item_dropped].range*(1.15**rebirth["equipment"].level)
					}

				} else {
					inventory[item_dropped].owned += loot_amount
				}
        let word, s
        if(loot_amount == 1) {
          word = "a "
        } else if(loot_amount == 2){
          word = "two "
        }
				messages.push({text: enemies[closest_enemy].species + " dropped " + word + item_dropped, timeout: Date.now()/1000 + 3})
			}
			enemies.splice(closest_enemy, 1)

			if(enemies.length == 0) {
				currentStage += 1
				if (currentStage > highestStages[currentArea - 1]) {
					highestStages[currentArea - 1] = currentStage
					rebirth_points += Math.floor(1.5*(currentStage - 1)*currentArea**2)

					let stage_names = Object.keys(quests_list)
					let current_stage_name = stage_names[currentArea - 1]
					if(currentStage > quests_list[current_stage_name]["waves"].progress) {
						quests_list[current_stage_name]["waves"].progress = currentStage
					}

					if(currentStage >= quests_list[current_stage_name]["waves"].goal) {
						rebirth_points += quests_list[current_stage_name]["waves"].reward
						quests_list[current_stage_name]["waves"].goal += 5
						quests_list[current_stage_name]["waves"].reward *= 5
						messages.push({text: "Quest completed!", timeout: Date.now()/1000 + 3})
						questStore.quest_points += 1
					}
				}
				bolts = []
				if(currentStage == 10) {
					if(currentArea == highestArea) {
						highestArea += 1
						highestStages[highestArea - 1] = 1
						battle.addButton("area " + highestArea, species_tags[highestArea - 1], "14px Arial", textColor, 9 + 88*(highestArea - 1), 10, function(number) {
							loadArea(number)
						}, 75, 75)
						battle.drawButton("area " + highestArea)
					}
          if(questStore["reset10"].toggled) {
						loadArea(currentArea)
					}
				}
				for(i=0; i<structures["totem"].totems.length; i++) {
					let x = 500*Math.random() + 150
					let y = 500*Math.random() + 150

					structures["totem"].totems[i].x = x
					structures["totem"].totems[i].y = y
				}
        for(i=0; i<structures["hall"].halls.length; i++) {
      		let x = 500*Math.random() + 150
      		let y = 500*Math.random() + 150

      		structures["hall"].halls[i].x = x
      		structures["hall"].halls[i].y = y
      	}
				spawnEnemies()
				team[0].x = 400
				team[0].y = 600

				var n = 0
				for(i=1; i<team.length; i++) {
          team[i].full = false
					team[i].x = 400 + 50*Math.cos(n*Math.PI)
					team[i].y = 600 + 50*Math.ceil(n/2)
					n += 1
				}
			}
		}

		function calc_def_ratio(temp_def) {
			let def_ratio = 0
			for(j=0; j<100; j++) {
				if (temp_def < 90) {
					return temp_def
				} else {
					def_ratio += 9*10**(-j + 1)
					temp_def -= 90*10**(j)
					if (temp_def < 90*10**(j+1)) {
						def_ratio += (temp_def/(100*10**(j + 1)))*10**(-j+1)
						return def_ratio
					}
				}
			}
		}

		var closest_dist = 2000
		var closest_enemy = 0
		for(i=0; i<enemies.length; i++){
			xdif = enemies[i].x - team[0].x
			ydif = enemies[i].y - team[0].y
			dist = Math.sqrt(xdif*xdif + ydif*ydif)
			if(dist < closest_dist) {
				closest_dist = dist
				closest_enemy = i
			}
		}
		xdif = enemies[closest_enemy].x - team[0].x
		ydif = enemies[closest_enemy].y - team[0].y

		var in_totem_range = false
		var speed_bonus = 1
		for(i=0; i<structures["totem"].totems.length; i++) {
			totem_xdif = structures["totem"].totems[i].x - team[0].x
			totem_ydif = structures["totem"].totems[i].y - team[0].y
			totem_dist = Math.sqrt(totem_xdif*totem_xdif + totem_ydif*totem_ydif)

			if(totem_dist < 75 + 25*(structures["totem"].level - 1)) {
				in_totem_range = true
			}
		}
		if(in_totem_range) {
			speed_bonus = 1.5
		}
    if(support["chamber"].owned && support["chamber"].radius < 50*support["chamber"].owned + 25) {
      support["chamber"].radius += support["chamber"].owned / 10
    }

		angle = Math.atan2(ydif, xdif)
		movex = team[0].speed*Math.cos(angle)*speed_bonus*devmode
		movey = team[0].speed*Math.sin(angle)*speed_bonus*devmode

		let ring_bonus = 0
		if(team[0].rings.includes("wooden ring") && (inventory[team[0].weapon].type == "bow" || inventory[team[0].weapon].type == "magic")) {
			ring_bonus = inventory["wooden ring"].range
		}
		if(team[0].tempWeapon && inventory[team[0].weapon].type == "sword" && closest_dist > inventory[team[0].weapon].range) {
			let temp = team[0].weapon
			team[0].weapon = team[0].tempWeapon
			team[0].tempWeapon = temp
		}
		if (closest_dist > inventory[team[0].weapon].range + ring_bonus) {
			let movedist = Math.sqrt(movex*movex + movey*movey)
			let goalmove = closest_dist - inventory[team[0].weapon].range - ring_bonus + 1
			if(goalmove < movedist) {
				movex = goalmove*Math.cos(angle)
				movey = goalmove*Math.sin(angle)
			}
			team[0].x += movex
			team[0].y += movey
		} else {
			if(Date.now()/1000 > team[0].cooldown){
				team[0].cooldown = Date.now()/1000 + inventory[team[0].weapon].cooldown/speed_bonus/devmode
				if(inventory[team[0].weapon].type == "bow" || inventory[team[0].weapon].type == "magic") {
					if(team[0].tempWeapon && closest_dist <= inventory[team[0].tempWeapon].range) {
						let temp = team[0].weapon
						team[0].weapon = team[0].tempWeapon
						team[0].tempWeapon = temp
					}
					bolts.push({
						x: team[0].x,
						y: team[0].y,
						targetid: closest_enemy,
						angle: 0
					})
				}
				if(inventory[team[0].weapon].type == "sword"){
					damage = team[0].attack + inventory[team[0].weapon].attack
					var temp_def = species[enemies[closest_enemy].species].defence*(1.1**enemies[closest_enemy].prestige)
					def_ratio = calc_def_ratio(temp_def)
					damage = damage/(100/(100-def_ratio))
					enemies[closest_enemy].health -= damage

					if(enemies[closest_enemy].health <= 0) {
						handleDeath(closest_enemy)
					}
				}
			}
		}
		if(bolts.length) {
			for (i=0; i<bolts.length; i++) {
				diffx = enemies[bolts[i].targetid].x - bolts[i].x
				diffy = enemies[bolts[i].targetid].y - bolts[i].y
				dist = Math.sqrt(diffx*diffx + diffy*diffy)

				if(dist < 20) {
					damage = team[0].attack + inventory[team[0].weapon].attack
					var temp_def = species[enemies[bolts[i].targetid].species].defence*(1.1**enemies[closest_enemy].prestige)
					def_ratio = calc_def_ratio(temp_def)
					damage = damage/(100/(100-def_ratio))
					enemies[bolts[i].targetid].health -= damage
					enemies[bolts[i].targetid].targetid = 0

					if(enemies[bolts[i].targetid].health <= 0) {
						handleDeath(bolts[i].targetid)
						bolts = []
					} else {
						bolts.splice(i, 1)
					}
				} else {
					angle = Math.atan2(diffy, diffx)
					bolts[i].angle = angle
					bolts[i].x += 5*Math.cos(angle)*devmode
					bolts[i].y += 5*Math.sin(angle)*devmode
				}
			}
		}

		for(i=1; i<team.length; i++) {
			var closest_dist = 2000
			var closest_enemy = 0
			for(j=0; j<enemies.length; j++){
				xdif = Math.abs(enemies[j].x - team[i].x)
				ydif = Math.abs(enemies[j].y - team[i].y)
				dist = Math.sqrt(xdif*xdif + ydif*ydif)
				if(dist < closest_dist) {
					closest_dist = dist
					closest_enemy = j
				}
			}

      if(challenges["aggroHero"].completed) {
        for(j=0; j<enemies.length; j++) {
          if(enemies[j].targetid == 0) {
            closest_enemy = j
          }
        }
      }

      closest_hall_dist = 2000
      closest_hall = 0
      for(j=0; j<structures["hall"].halls.length; j++) {
        hallxdif = structures["hall"].halls[j].x - team[i].x
				hallydif = structures["hall"].halls[j].y - team[i].y
				halldist = Math.sqrt(hallxdif*hallxdif + hallydif*hallydif)

        if(halldist < closest_hall_dist) {
					closest_hall_dist = halldist
					closest_hall = j
				}
      }

			xdif = enemies[closest_enemy].x - team[i].x
			ydif = enemies[closest_enemy].y - team[i].y

      in_totem_range = false
			for(j=0; j<structures["totem"].totems.length; j++) {
				totem_xdif = structures["totem"].totems[j].x - team[i].x
				totem_ydif = structures["totem"].totems[j].y - team[i].y
				totem_dist = Math.sqrt(totem_xdif*totem_xdif + totem_ydif*totem_ydif)

				if(totem_dist < 75 + 25*(structures["totem"].level - 1)) {
					in_totem_range = true
				}
			}
			if(in_totem_range) {
				speed_bonus = 1.5
			}

      let in_hero_range = false
      if(templeRewards["aura"]) {
        hero_xdif = Math.abs(team[0].x - team[i].x)
        hero_ydif = Math.abs(team[0].y - team[i].y)
        dist = Math.sqrt(hero_xdif*hero_xdif + hero_ydif*hero_ydif)
        if(dist < 150) {
          in_hero_range = true
        }
      }

      let total_health = species[team[i].name].health * (1.5**rebirth["ally"].level) * (housing[team[i].name].level + 4)/5
      if(!team[i].full && team[i].health <= .8*total_health && closest_hall_dist < closest_dist) {
        xdif = structures["hall"].halls[closest_hall].x - team[i].x
  			ydif = structures["hall"].halls[closest_hall].y - team[i].y

        angle = Math.atan2(ydif, xdif)
  			movex = 5*Math.cos(angle)*speed_bonus*devmode
  			movey = 5*Math.sin(angle)*speed_bonus*devmode

        if(closest_hall_dist > 15) {
          team[i].x += movex
          team[i].y += movey
        } else {
          team[i].health += 25*1.85**(structures["hall"].level + 2)
          if(team[i].health > total_health) {
            team[i].health = total_health
          }
          team[i].full = true
        }
      } else {
        angle = Math.atan2(ydif, xdif)
  			movex = 5*Math.cos(angle)*speed_bonus*devmode
  			movey = 5*Math.sin(angle)*speed_bonus*devmode

  			if (closest_dist > 25) {
  				let movedist = Math.sqrt(movex*movex + movey*movey)
  				let goalmove = closest_dist - 24
  				if(goalmove < movedist) {
  					movex = goalmove*Math.cos(angle)
  					movey = goalmove*Math.sin(angle)
  				}
  				team[i].x += movex
  				team[i].y += movey
  			} else {
  				if(Date.now()/1000 > team[i].cooldown){
  					damage = species[team[i].name].attack * (1.25**rebirth["ally"].level) * (housing[team[i].name].level + 4)/5
            if(in_hero_range) {
              damage *= 1.5
            }
  					var temp_def = species[enemies[closest_enemy].species].defence*(1.2**enemies[closest_enemy].prestige)
  					def_ratio = calc_def_ratio(temp_def)
  					damage = damage/(100/(100-def_ratio))
  					enemies[closest_enemy].health -= damage
  					team[i].cooldown = Date.now()/1000 + 1/speed_bonus/devmode
  				}
        }
			}
			if(enemies[closest_enemy].health <= 0) {
				handleDeath(closest_enemy)
			}
		}

		for(i=0; i<enemies.length; i++) {
			var closest_dist = 2000
			var closest_enemy = 0
      for(j=0; j<team.length; j++){
				xdif = Math.abs(enemies[i].x - team[j].x)
				ydif = Math.abs(enemies[i].y - team[j].y)
				dist = Math.sqrt(xdif*xdif + ydif*ydif)
				if(dist < closest_dist) {
					closest_dist = dist
					closest_enemy = j
				}
			}

      let slow_multiplier = 1
      xdif = Math.abs(enemies[i].x - team[0].x)
      ydif = Math.abs(enemies[i].y - team[0].y)
      dist = Math.sqrt(xdif*xdif + ydif*ydif)
      if(dist < support["chamber"].radius) {
        slow_multiplier = 1 - .05*(support["chamber"].level + 1)
      }

			if(closest_dist > 100) {
				enemies[i].trajectory.turning += (.5 - Math.random())/200
				if(Math.abs(enemies[i].trajectory.turning) > .02) {
					enemies[i].trajectory.turning = enemies[i].trajectory.turning/2
				}
				enemies[i].trajectory.angle += enemies[i].trajectory.turning

				if(enemies[i].x < 85) {
					enemies[i].x = 85
					enemies[i].trajectory.angle += Math.PI
				} else if(enemies[i].x > 775) {
					enemies[i].x = 775
					enemies[i].trajectory.angle += Math.PI
				}
				if(enemies[i].y < 25) {
					enemies[i].y = 25
					enemies[i].trajectory.angle += Math.PI
				} else if(enemies[i].y > 675) {
					enemies[i].y = 675
					enemies[i].trajectory.angle += Math.PI
				}

				enemies[i].x += 2*Math.cos(enemies[i].trajectory.angle)/10
				enemies[i].y += 2*Math.sin(enemies[i].trajectory.angle)/10
			} else {
        if(!challenges["aggroHero"].inProgress) {
  				enemies[i].targetid = closest_enemy
        } else {
          enemies[i].targetid = 0
          closest_enemy = 0

          xdif = Math.abs(enemies[i].x - team[0].x)
  				ydif = Math.abs(enemies[i].y - team[0].y)
  				dist = Math.sqrt(xdif*xdif + ydif*ydif)
					closest_dist = dist
        }

				if (enemies[i].species == "beast") {
					for(j=0; j<enemies.length; j++){
						if (i != j && enemies[j].species == "beast" && enemies[j].targetid == undefined) {
							xdif = enemies[i].x - enemies[j].x
							ydif = enemies[i].y - enemies[j].y
							dist = Math.sqrt(xdif*xdif + ydif*ydif)
							if(dist < 100) {
								enemies[j].targetid = enemies[i].targetid
								messages.push({text: "A beast has joined the pack!", timeout: Date.now()/1000 + 3})
							}
						}
					}
				}
			}
			if(enemies[i].targetid != undefined){
				if(enemies[i].cooldown == undefined) {
					enemies[i].cooldown = Date.now()/1000 + 1/(1.1**enemies[i].prestige)/devmode
				}
				xdif = Math.abs(enemies[i].x - team[closest_enemy].x)
				ydif = Math.abs(enemies[i].y - team[closest_enemy].y)
				dist = Math.sqrt(xdif*xdif + ydif*ydif)
				xdif = team[closest_enemy].x - enemies[i].x
				ydif = team[closest_enemy].y - enemies[i].y
				angle = Math.atan2(ydif, xdif)
				movex = Math.cos(angle)*(1.05**enemies[i].prestige)*slow_multiplier*devmode
				movey = Math.sin(angle)*(1.05**enemies[i].prestige)*slow_multiplier*devmode
				if(dist > 25) {
					let movedist = Math.sqrt(movex*movex + movey*movey)
					let goalmove = closest_dist - 24
					if(goalmove < movedist) {
						movex = goalmove*Math.cos(angle)
						movey = goalmove*Math.sin(angle)
					}
					enemies[i].x += movex
					enemies[i].y += movey
				} else {
					if(Date.now()/1000 > enemies[i].cooldown){
						damage = species[enemies[i].species].attack*(1.2**enemies[i].prestige)
						if(closest_enemy == 0) {
              support["chamber"].radius = 0
							defence = team[0].defence
							defence += team[0].helmet ? inventory[team[0].helmet].defence : 0
							defence += team[0].torso ? inventory[team[0].torso].defence : 0
							defence += team[0].legs ? inventory[team[0].legs].defence : 0
						} else {
							defence = team[closest_enemy].defence * (1.25**rebirth["ally"].level) * (housing[team[closest_enemy].name].level + 4)/5
						}
						def_ratio = calc_def_ratio(defence)
						damage = damage/(100/(100-def_ratio))
						team[closest_enemy].health -= damage
						enemies[i].cooldown = Date.now()/1000 + 1/(1.1**enemies[i].prestige)/devmode
					}

					if(team[closest_enemy].health <= 0) {
						team[closest_enemy].health = 0
						if(team[closest_enemy]["name"] == "hero") {
              if(!challenges["1HP"].inProgress) {
                team[0].health = 100

                if(challenges["1HP"].completed) {
                  team[0].health *= 10
                }
              } else {
                team[0].health = 1
              }

							loadArea(currentArea)
						} else {
							for(j=0; j<enemies.length; j++) {
								if(enemies[j].targetid == closest_enemy) {
									enemies[j].targetid = undefined
								}
							}
							housing[team[closest_enemy].name].filled -= 1
							team.splice(closest_enemy, 1)
						}
					}
				}
			}
		}
	}

	var now = Date.now(),
		delta = (now - then)/1000

	ctx = this.canvas.getContext("2d")

	createCanvas()
	if(currentPage == "battle"){
		update(delta)
	}

	then = now

	window.requestAnimationFrame(main)
}

window.onload = function() {
	document.getElementById("cv").addEventListener("click", function(event) {
		var x = event.offsetX,
			y = event.offsetY
			for(var page in pages) {
				if(page == currentPage) {
					pages[page].checkForPress(x, y)
					break
				}
			}
	})

	canvas = document.getElementById("cv")

	spawnEnemies()
	main()
}
