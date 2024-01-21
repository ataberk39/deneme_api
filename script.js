//globals
let page = 1;

//objects
let cacheObject = {
  data: {},
  addData: function (pageNo, items) {
    cacheObject.data[pageNo.toString()] = [...items];
  },
  removeData: function (pageNo) {
    delete cacheObject.data[pageNo];
    return !cacheObject.checkData(pageNo);
  },
  getData: function (pageNo) {
    let result = cacheObject.data[pageNo.toString()];
    return result;
  },
  checkData: function (pageNo) {
    // if (cacheObject.data.hasOwnProperty(pageNo)){
    //   return true;
    // }
    // return false
    return cacheObject.data.hasOwnProperty(pageNo);
  },
  gelAllData: function () {
    let result = [];
    let tmp_obj_values = Object.values(cacheObject.data);

    for (let i = 0; i < tmp_obj_values.length; i++) {
      let items = tmp_obj_values[i];
      result.push(...items);
    }
    let tmp_set = new Set(result);
    return Array.from(tmp_set);
  },
};

let data = {
  getData: function (page = 1, cb) {
    if (cacheObject.checkData(page)) {
      cb(cacheObject.getData(page));
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        let tmp_obj = JSON.parse(this.responseText);
        cacheObject.addData(page, tmp_obj.results);
        cb(tmp_obj.results);
      }
    });

    xhr.open("GET", `http://localhost:5500/data${page}.json`);
    xhr.send();
  },
  getDataAsync: function (page = 1) {
    return new Promise((resolve, reject) => {
      try {
        data.getData(page, function (result) {
          resolve(result);
        });
      } catch (error) {
        console.log("error", error);
        reject(error);
      }
    });
  },
  filterData: function (text) {
    let all_data = cacheObject.gelAllData();
    let result_arr = all_data.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    return result_arr;
  },
};

let container = {
  filterContainer: function () {
    let my_tmp_arr = data.filterData(text);
    fillContainerWithData(my_tmp_arr);
  },
  fillContainerWithData: function (dataArray) {
    let myContainer = document.getElementsByClassName("container")[0];
    myContainer.innerHTML = "";
    for (let i = 0; i < dataArray.length; i++) {
      const characterData = dataArray[i];
      container.makeDivForCharacterCard(characterData, myContainer);
    }
  },
  makeDivForCharacterCard: function (characterData, container) {
    let myDiv = document.createElement("div");
    myDiv.classList.add("character-card");
    container.appendChild(myDiv);

    let myImg = document.createElement("img");
    myImg.setAttribute("src", characterData.image);
    myDiv.appendChild(myImg);

    let character = document.createElement("h2");
    character.innerText = characterData.name + "(" + characterData.gender + ")";
    myDiv.appendChild(character);
  },
  generateMylist:async function(page = 1) {
    let result = await data.getDataAsync(page);
    // let currentData = JSON.parse(result);
    container.fillContainerWithData(result);
    // data.getData(page, function(result){
    //     let currentData = JSON.parse(result);
    //     fillContainerWithData(currentData);
    // });
  }
};

// function makeDivForCharacterCard(characterData){
//     let character_card_template = `<div class="character-card">
//         <img src="${characterData.image}" />
//         <h2>${characterData.name}(${characterData.gender})</h2>
//     </div>`;

//     return character_card_template;
// }

async function next() {
  let totalFiles = 4;
  if (page < totalFiles) {
    page++;
    await generateMylist(page);
  } else {
    console.log("tamamlandı");
  }
}

async function prev() {
  if (1 < page) {
    page--;
    await generateMylist(page);
  } else {
    console.log("tamamlandı");
  }
}
function search(){
  let searchText = document.getElementById("searchText")
  let search_Text = searchText.value
  let tmp_arr = data.filterData(search_Text)
  container.fillContainerWithData(tmp_arr)
}



//document events
document.addEventListener("DOMContentLoaded", async function () {
  await container.generateMylist();
});
