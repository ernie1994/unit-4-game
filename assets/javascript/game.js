$(document).ready(function () {

    var characters = [
        {
            name: "Obi-Wan Kenobi",
            imageName: "Obi-Wan",
            healthPoints: 160,
            attackPower: 40,
            counterAttackPower: 34
        },
        {
            name: "Luke Skywalker",
            imageName: "Luke_Skywalker",
            healthPoints: 10,
            attackPower: 56,
            counterAttackPower: 20
        },
        {
            name: "Darth Maul",
            imageName: "darth_maul",
            healthPoints: 100,
            attackPower: 25,
            counterAttackPower: 12
        },
        {
            name: "Darth Sidious",
            imageName: "Darth_Sidious",
            healthPoints: 211,
            attackPower: 65,
            counterAttackPower: 55
        },
    ];

    var player;
    var enemies = [];
    var defender;

    function characterWithId(id) {
        var obj = {};
        characters.forEach((element) => {
            if (element.name == id) {
                obj = Object.assign({}, element);
            }
        });
        return obj;
    }

    function setUpCharacters() {

        characters.forEach((character) => {
            var charDiv = $("<div>");
            charDiv.attr("class", "character");
            charDiv.attr("id", character.name);
            var name = "<h4>" + character.name + "</h4>";
            var img = "<img src='assets/images/" + character.imageName + ".jpg'>";
            var health = "<h6>" + character.healthPoints + "</h6>";
            charDiv.append(name);
            charDiv.append(img);
            charDiv.append(health);

            $("body").append(charDiv);
        });
    }

    function setUpElements() {
        var yourTitle = $("<h2>");
        yourTitle.text("Your Character");
        $("body").append(yourTitle);

        var yourDiv = $("<div>");
        yourDiv.attr("id", "yourCharacter");
        $("body").append(yourDiv);

        var enemiesTitle = $("<h2>");
        enemiesTitle.text("Enemies Available To Attack");
        $("body").append(enemiesTitle);

        var enemies = $("<div>");
        enemies.attr("id", "enemies");
        $("body").append(enemies);

        var fightTitle = $("<h2>");
        fightTitle.text("Fight Section");
        $("body").append(fightTitle);

        var attackButton = $("<button>");
        attackButton.text("Attack");
        attackButton.attr("id", "attack");
        $("body").append(attackButton);

        var defenderTitle = $("<h2>");
        defenderTitle.text("Defender");
        $("body").append(defenderTitle);

        var defender = $("<div>");
        defender.attr("id", "defender");
        $("body").append(defender);

        var defenderSubtitles = $("<h6>");
        defenderSubtitles.attr("id", "subtitles");
        $("body").append(defenderSubtitles);


    }

    function setUpPage() {
        setUpCharacters();
        setUpElements();
    }

    function addRestartBtn() {
        var restartBtn = $("<button>");
        restartBtn.attr("id", "restart");
        restartBtn.text("Restart");
        $("body").append(restartBtn);
    }

    function gameOver() {
        addRestartBtn();
        $("#attack").attr("disabled", "true");
    }

    setUpPage();

    $("body").on("click", ".character", function () {
        if (!player) {
            characters.forEach((character) => {
                var name = character.name;
                if (name == $(this).attr("id")) {
                    player = Object.assign({ numAttacks: 0 }, character);
                }
                else {
                    var enemy = document.getElementById(name);
                    $(enemy).attr("class", "enemy");
                    enemies.push(Object.assign({}, character));
                }
            });
            $(".enemy").appendTo($("#enemies"));
            $(".character").appendTo($("#yourCharacter"));
        }
    });

    $("body").on("click", ".enemy", function () {
        if (!defender) {

            var newDefender = characterWithId($(this).attr("id"));

            enemies = enemies.filter((value) => {
                if (value.name == newDefender.name) {
                    return false;
                }
                return true;
            });

            defender = newDefender;

            $(this).remove();
            $(this).attr("class", "defender");
            $("#defender").append($(this));

            $("#subtitles").text("");
        }
    });

    $("body").on("click", "#attack", function () {

        if (!defender) {
            $("#subtitles").html("No enemy here");
            return;
        }

        var yourDamage = defender.counterAttackPower;
        var defendersDamage = player.attackPower;

        defender.healthPoints -= defendersDamage;
        player.healthPoints -= yourDamage;

        $(".defender").children("h6").text(defender.healthPoints);
        $(".character").children("h6").text(player.healthPoints);

        var firstLine = "You attacked " + defender.name + " for " + player.attackPower + " damage";
        var secondLine = defender.name + " attacked you back for " + defender.counterAttackPower + " damage";

        $("#subtitles").html(firstLine + "<br>" + secondLine);

        player.numAttacks++;
        player.attackPower += player.numAttacks * 15;

        if (defender.healthPoints <= 0) {
            var sub = "You have defeated " + defender.name + ".  You can choose to fight another enemy.";
            $("#subtitles").text(sub);
            defender = null;
            $(".defender").remove();
        }
        if (player.healthPoints <= 0) {
            $("#subtitles").html("You have been defeated. GAME OVER");
            gameOver();
        }

        if (!defender && enemies.length == 0 && player.healthPoints > 0) {
            $("#subtitles").html("You won!!!! GAME OVER");
            gameOver();
        }
    });

    $("body").on("click", "#restart", function () {
        $("body").children().not("h1").remove();
        setUpPage();
        defender = null;
        enemies = [];
        player = null;
    });

});