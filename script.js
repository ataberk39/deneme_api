//globals
let page = 1;

//objects
let data = {
    getData: function (page = 1, cb) {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function() {
            if(this.readyState === 4) {
                cb(this.responseText);
            }
        });

        xhr.open("GET", `http://localhost:5500/data${page}.json`);
        xhr.send();

    },
    getDataAsync : function(page=1){
        return new Promise((resolve, reject )=> {
            try {
                data.getData(page, function(result){
                    resolve(result);
                });    
            } catch (error) {
                console.log('error', error);
                reject(error);
            }
        });
    }

};




// function makeDivForCharacterCard(characterData){
//     let character_card_template = `<div class="character-card">
//         <img src="${characterData.image}" />
//         <h2>${characterData.name}(${characterData.gender})</h2>
//     </div>`;

//     return character_card_template;
// }

function makeDivForCharacterCard(characterData){
    debugger
    let myContainer = document.getElementsByClassName("container")[0]

    let myDiv = document.createElement("div")
    myDiv.classList.add("character-card")
    myContainer.appendChild(myDiv)

    let myImg = document.createElement("img")
    myImg.setAttribute("src",characterData.image)
    myDiv.appendChild(myImg)

    let character = document.createElement("h2")
    character.innerHTML = characterData.name + "(" + characterData.gender + ")"
    myDiv.appendChild(character)

    return myDiv
}

function fillContainerWithData(dataArray){
    let my_container = document.getElementsByClassName('container')[0]
    let container_html = '';
    for (let i = 0; i < dataArray.results.length; i++) {
        const characterData = dataArray.results[i];
        container_html += makeDivForCharacterCard(characterData);
    }
    my_container.innerHTML = container_html;
}

async function generateMylist(page=1){
    let result = await data.getDataAsync(page);
    let currentData = JSON.parse(result);
    fillContainerWithData(currentData);
    // data.getData(page, function(result){
    //     let currentData = JSON.parse(result);
    //     fillContainerWithData(currentData);
    // });
}

async function next() {
    let totalFiles = 4
    if (page < totalFiles ){
        page++;
        await generateMylist(page);
    }else{
        console.log("tamamlandı")
    }
    
}

async function prev() {
    if( 1 < page){
        page--;
        await generateMylist(page);
    }else{
        console.log("tamamlandı")
    }
    
}

//document events
document.addEventListener('DOMContentLoaded',async function () {
    await generateMylist();
})