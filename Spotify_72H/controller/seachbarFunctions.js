window.onload = (event) => {
    
    //CHANGEMENT D'ONGLET
    $(".nav-item").on("click",(event) => {
        console.log($(event.target))
        $(".nav-link").removeClass("active");
        $(event.target).addClass("active");
        dynamicSearch();
    })
    $("#resultsTable").html("<div class='resultTable'></div>");
 };


function dynamicSearch(){

    controller = new AbortController()
    signal = controller.signal

    userQuery = $("#searchBar").val();
    if (userQuery == ""){
        $("#resultsTable").html("<div class='resultTable'></div>");
        $("#pageBar").html("");
        return;
    }

    let url = 'http://localhost:8000/';
    activeCategory = $("#categorySelector").find(".active").attr("id");
    $("#resultsTable").html("");
    
    resultNumber = 0;
    pageNumber = 1;
    resultsPerPage = 20;

    let newPage = document.createElement("tbody");
    $(newPage).attr("id","page1");
    $("#resultsTable").append(newPage);

    $("#pageBar").html("");
    let newPageButton = document.createElement("li");
    $(newPageButton).addClass("page-item active");
    $(newPageButton).attr("id","pageButton"+1);
    $(newPageButton).html('<a class="page-link" onclick="changePage(1)" tabindex="-1">1</a>');
    $("#pageBar").append(newPageButton);

    switch (activeCategory) {
        case "album":

            fetch(url+"albums",{signal: signal}).then(response=>response.json().then((data)=>{
                data.forEach(album => {
                    if (album.name.toLowerCase().includes(userQuery.toLowerCase())){
                        newResult = document.createElement("tr");
                        $(newResult).html("<td><a class='resultLink' href='./album.php?id="+album.id+"'>"+album.name+"</a></td>");
                        $("#page"+pageNumber).append(newResult);

                        resultNumber++;

                        if (resultNumber >= resultsPerPage) {
                            pageNumber++;
                            resultNumber = 0;
                            let newPage = document.createElement("tbody");
                            $(newPage).attr("id","page"+pageNumber);
                            $(newPage).hide();
                            $("#resultsTable").append(newPage);

                            let newPageButton = document.createElement("li");
                            $(newPageButton).addClass("page-item");
                            $(newPageButton).attr("id","pageButton"+pageNumber);
                            $(newPageButton).html('<a class="page-link" onclick="changePage('+pageNumber+')" tabindex="-1">'+pageNumber+'</a>');
                            $("#pageBar").append(newPageButton);
                        }
                    }
                });
            }));
            break;
    
        case "artiste":
            fetch(url+"artists").then(response=>response.json().then((data)=>{
                data.forEach(artist => {
                    if (artist.name.toLowerCase().includes(userQuery.toLowerCase())){
                        newResult = document.createElement("tr");

                        $(newResult).html("<td><a class='resultLink' href='./artiste.php?id="+artist.id+"'>"+artist.name+"</a></td>");
                        $("#page"+pageNumber).append(newResult);

                        resultNumber++;

                        if (resultNumber >= resultsPerPage) {
                            pageNumber++;
                            resultNumber = 0;
                            let newPage = document.createElement("tbody");
                            $(newPage).attr("id","page"+pageNumber);
                            $(newPage).hide();
                            $("#resultsTable").append(newPage);

                            let newPageButton = document.createElement("li");
                            $(newPageButton).addClass("page-item");
                            $(newPageButton).attr("id","pageButton"+pageNumber);
                            $(newPageButton).html('<a class="page-link" onclick="changePage('+pageNumber+')" tabindex="-1">'+pageNumber+'</a>');
                            $("#pageBar").append(newPageButton);
                        }
                    }
                });
            }));
            break;
    
        case "genre":
            fetch(url+"genres").then(response=>response.json().then((data)=>{
                data.forEach(genre => {
                    if (genre.name.toLowerCase().includes(userQuery.toLowerCase())){
                        newResult = document.createElement("tr");

                        $(newResult).html("<td><a class='resultLink' href='./genre.php?id="+genre.id+"'>"+genre.name+"</a></td>");
                        $("#page"+pageNumber).append(newResult);

                        resultNumber++;

                        if (resultNumber >= resultsPerPage) {
                            pageNumber++;
                            resultNumber = 0;
                            let newPage = document.createElement("tbody");
                            $(newPage).attr("id","page"+pageNumber);
                            $(newPage).hide();
                            $("#resultsTable").append(newPage);

                            let newPageButton = document.createElement("li");
                            $(newPageButton).addClass("page-item");
                            $(newPageButton).attr("id","pageButton"+pageNumber);
                            $(newPageButton).html('<a class="page-link" onclick="changePage('+pageNumber+')" tabindex="-1">'+pageNumber+'</a>');
                            $("#pageBar").append(newPageButton);
                        }
                    }
                });
            }));
            break;

        default:
            break;
    }

}

function changePage(pageNumber) {

    $("#resultsTable").children("tbody").hide();
    $("#page"+pageNumber).show();

    $("#pageBar").children("li").removeClass("active");
    $("#pageButton"+pageNumber).addClass("active");

}