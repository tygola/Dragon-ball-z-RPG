$(document).ready(function() {
	var bakcgroundImageArray = ["slide.png", 
	"slide-12.jpg", "slide-15.jpeg"];
	var bakcgroundImageIndex = 0;
	function changeBackground() {
		if (bakcgroundImageIndex >= bakcgroundImageArray.length) {
			bakcgroundImageIndex = 0;
		}
		$('#body').css("background-image", "url(assets/images/" + bakcgroundImageArray[bakcgroundImageIndex] + ")");
		bakcgroundImageIndex++;
	}
	setInterval(changeBackground, 10000);

	var characters = [];
	var playerCharacterId = -1;
	var enemyCharacterId = -1;

	characters.push({"Health Points": 0,
		"Base Attack Power": 0,
		"Attack Power": 0, 
		"Counter Attack Power": 0,
		"Name": "Goku",
		"Golpe": "Kamehameha",
		"Image": "goku.png",});
	characters.push({"Health Points": 0,
		"Base Attack Power": 0,
		"Attack Power": 0, 
		"Counter Attack Power": 0,
		"Name": "Vegeta",
		"Golpe": "Galick hu",
		"Image": "vegeta.png"});
	characters.push({"Health Points": 0,
		"Base Attack Power": 0,
		"Attack Power": 0, 
		"Counter Attack Power": 0,
		"Name": "Broly",
		"Golpe": "Explosion",
		"Image": "Broly.png"});
	characters.push({"Health Points": 0,
		"Base Attack Power": 0,
		"Attack Power": 0, 
		"Counter Attack Power": 0,
		"Name": "Freeza",
		"Golpe": "Death bean",
		"Image": "Freeza.png"});

	$.each(characters, function (index, character){
		generateCharacterAttributeValues(character) ;
		$("#characters").append(generateCharacterHtml(index, character));
	});

	// gerar o conteúdo html para cada um dos personagens na página da web
	function generateCharacterHtml(index, character) {
		/*
		<div class="character col-md-2" id="0">
			<button type="button" class="btn btn-default m-3 p-2">
	    		<p>goku</p>
	    		<img src="assets/images/goku.png" class="character-image">
	    		<p>141</p>
		    </button>
		</div>
		*/
		var div = $("<div>");
		if (index !== 0) {
			div.attr("class", "character col-md-2 offset-md-1");
		} else {
			div.attr("class", "character col-md-2");
		}
		div.attr("id", index);
		var buttonContainer = $("<button>");
		buttonContainer.attr("type", "button");
		buttonContainer.attr("class", "btn btn-default m-3 p-2");
		var name = $("<p>");
		name.text(character["Name"]);
		var image = $("<img>");
		image.attr("src", "assets/images/" + character["Image"]);
		image.attr("class", "character-image");
		var healthPoints = $("<p>");
		healthPoints.text(character["Health Points"]);
		buttonContainer.append(name).append(image).append(healthPoints);
		div.append(buttonContainer);
		return div;
	}

	// gerar os valores de atributo para cada um dos personagens
	function generateCharacterAttributeValues(character) {
		character["Health Points"] = Math.floor(Math.random() * 200) + 75;
		character["Base Attack Power"] = Math.floor(Math.random() * 15) + 5;
		character["Attack Power"] = character["Base Attack Power"];
		character["Counter Attack Power"] = Math.floor(Math.random() * 30) + 10;
	}

	// gerar o conteúdo html para os personagens selecionados para o jogo
	function generateSelectedCharacterHtml(parentHtmlId, characterHtml) {
		$(parentHtmlId).html(characterHtml);
	}

	function updateHtmlText(htmlElement, value) {
		$(htmlElement).text(value);
	}

	function gameFeedback(feedback) {
		if (feedback) {
			$("#game-feedback").append("<br>" + feedback);
		} else {
			$("#game-feedback").text("");
		}
	}

	function restartGame() {
		updateHtmlText($("#attack-button"), "Restart Game");
		$("#attack-button").on("click", function(){
			location.reload();
		});
	}

	$("#attack-button").on("click", function(){
		if (playerCharacterId !== -1 && enemyCharacterId !== -1) {
			var playerCharacter = characters[playerCharacterId];
			var enemyCharacter = characters[enemyCharacterId];
			// o personagem do jogador ataca primeiro
			var playerOnEnemyDamage = playerCharacter["Attack Power"];
			enemyCharacter["Health Points"] -=  playerOnEnemyDamage;
			playerCharacter["Attack Power"] +=playerCharacter["Base Attack Power"];
			updateHtmlText($("#enemy-character button").children().last(), enemyCharacter["Health Points"]);
			gameFeedback();
			gameFeedback("<h5>Você atacou " + enemyCharacter["Name"] + " com " + playerCharacter["Golpe"] + " de " + playerOnEnemyDamage + " de dano.</h5>");

			// se o inimigo está sem pontos de saúde, o inimigo é derrotado
			if (enemyCharacter["Health Points"] <= 0) {
				enemyCharacterId = -1;
				// verifique se há mais caracteres restantes na div #personagem para o jogador lutar
				if ($("#characters").text().length !== 0){
					generateSelectedCharacterHtml("#enemy-character", "ENEMY CHARACTER");
					gameFeedback("Você derrotou " + enemyCharacter["Name"] + "! Escolha outro inimigo para lutar.");
				} else {
					gameFeedback("Você Venceu! Por favor, pressione o \"Restart Game\" botão para jogar novamente.");
					restartGame();
				}
			}

			// se o personagem inimigo ainda estiver vivo (ou seja, tiver> 0 pontos de saúde),
			// o personagem inimigo contra-ataca
			if (enemyCharacterId !== -1) {
				playerCharacter["Health Points"] -=  enemyCharacter["Counter Attack Power"];
				updateHtmlText($("#player-character button").children().last(), playerCharacter["Health Points"]);
				gameFeedback(enemyCharacter["Name"] + " atacou " + "você de volta com " + enemyCharacter["Golpe"] + " de "  + enemyCharacter["Counter Attack Power"] + " de dano.");
			}

			// se o jogador estiver sem pontos de saúde, ele é derrotado e terá que reiniciar o jogo
			if (playerCharacter["Health Points"] <= 0) {
				gameFeedback("Game Over! Por favor, pressione o \"Restart Game\" botão para jogar novamente.");
				restartGame();
			}
		}
	});

	$(".character").on("click", function(){
		if ($("#player-character").text().length === "YOUR CHARACTER".length) {
			generateSelectedCharacterHtml("#player-character", $(this).html());
			playerCharacterId = $(this).attr("id");
			generateSelectedCharacterHtml($("#" + playerCharacterId), "");
		} else if ( $("#player-character").text().length !== "YOUR CHARACTER".length && $("#enemy-character").text().length === "ENEMY CHARACTER".length ) {
			generateSelectedCharacterHtml("#enemy-character", $(this).html());
			enemyCharacterId = $(this).attr("id");
			generateSelectedCharacterHtml($("#" + enemyCharacterId), "");
			gameFeedback();
		} else if ($("#enemy-character").text().length === 0) {
			generateSelectedCharacterHtml("#enemy-character", "ENEMY CHARACTER");
		}

	});

});

