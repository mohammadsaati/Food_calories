//Storage Ctroler
const LocalStorageCtrl = (function() {


    //Public method
    return {
    //Add in ls
    storData : function(item) {
        let items;
        if(localStorage.getItem('items') === null) {
            items = [];

            items.push(item);

            localStorage.setItem('items' , JSON.stringify(items));
        } else {
            items = JSON.parse(localStorage.getItem('items'));
            items.push(item);
            localStorage.setItem('items' , JSON.stringify(items));
        }
    },
    getItemsFromLocalStorage : function() {
        let items;
        if(localStorage.getItem('items') === null) {
            items = [];
        } else {
            items = JSON.parse(localStorage.getItem('items'));
        }
        return items;
    }, 
    updatedItemLocalStorage : function(updatedItem) {
        let items = JSON.parse(localStorage.getItem('items'));

        items.forEach(function(item , index){
           if(updatedItem.id === item.id) {
                items.splice(index , 1 , updatedItem);
           }
        });

        localStorage.setItem('items' , JSON.stringify(items));
    },
    deleteItemLocalStorage : function(id) {
        let items = JSON.parse(localStorage.getItem('items'));

        items.forEach(function(item , index){
           if(id === item.id) {
                items.splice(index , 1);
           }
        });

        localStorage.setItem('items' , JSON.stringify(items));
    },
    clearItemsLocalStorage : function() {
        let items = [];
        localStorage.setItem('items' , JSON.stringify(items));
    }
    } 
})();

//Item Controler
const ItemCtrl = (function(){
    //Constructor
    const Item = function(id , name , calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Date Structure
    const data = {
        items : LocalStorageCtrl.getItemsFromLocalStorage(),
        currentItem : null,
        totalcalories : 0
    }


    //Public method
    return {
        getItems : function() {
            return data.items;
        },

        logData : function() {
           return data
        },

        //Add item
        addItem : function(name , calories) {
            let Id;
            if(data.items.length > 0) {
                Id = data.items[data.items.length - 1].id + 1;
            } else {
                Id = 0;
            }

            //Pars calories
            calories = parseInt(calories);

            //Create item
            const newItem = new Item(Id , name , calories);

            //Add into data
            data.items.push(newItem);

            //Add in to local storage
            LocalStorageCtrl.storData(newItem);

            return newItem;
        },

        //TotalCalories
        getTotalCalories : function() {
            let total = 0;

            data.items.forEach(function(item){
                total +=  item.calories;
            });

            data.totalcalories = total;

            return data.totalcalories;
        },

        //Find item by id
        getItemById : function(id) {
            let found = null;
            data.items.forEach(function(item) {
                if(item.id === id) {
                    found = item;
                }
            });

            return found;
        },

        //Set current 
        setCurrentItem : function(current) {
            data.currentItem = current;
        },
        getCurrentItem : function() {
            return data.currentItem;
        },

        //Update items
        updateItem : function(name , calories) {
            let found = null;

            calories = parseInt(calories);

            data.items.forEach(function(item) {
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },

        delteItem : function(id) {
            //Get ids
            const ids = data.items.map(function(item) {
                return item.id;
            });

            //Get index
            const index = ids.indexOf(id);
            //Delete item
            data.items.splice(index , 1);
        },
        
        //Clear all items
        clearItems : function() {
            return item = [];
        }

 
    }
})();

//UI Controler
const UICtrl = (function() {
    
    //UI selectors 
    const UISelectors = {
        itemList: '#item-list',
        listItem : '#item-list li',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories : '.total-calories',
        updateBtn : '.update-btn',
        deleteBtn : '.delete-btn',
        backBtn : '.back-btn',
        clearBtn : '.clear-btn'
      }

    //Public method
    return {
        populateItemList : function(items) {
            let html = '';
            
            items.forEach(function(item){
                html += `
                <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>
              `;
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        getSelectors : function() {
            return UISelectors;
        },

        getItemInput : function() {
            return {
                name : document.querySelector(UISelectors.itemNameInput).value,
                calories : document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },

       

        clearEditState : function() {
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';

        },

        updateEditState : function() {
            document.querySelector(UISelectors.addBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
        },

        addListItem : function(item) {
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;

            //append li in ul
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend' , li);

            //clear input
            document.querySelector(UISelectors.itemNameInput).value = ' ';
            document.querySelector(UISelectors.itemCaloriesInput).value = ' ';
        },

        clearInputs : function(){
            document.querySelector(UISelectors.itemNameInput).value = ' ';
            document.querySelector(UISelectors.itemCaloriesInput).value = ' ';
        },

        //Update item
        updateItem : function(item) {
            let listItem = document.querySelectorAll(UISelectors.listItem);
            //Turn into Array
            listItem = Array.from(listItem);
            //Loop in listItems
            listItem.forEach(function(listItems) {
                const listID = listItems.getAttribute('id');
                if(listID === `item-${item.id}`) {
                    document.querySelector(`#${listID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                      <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            });
        },

        //Show total calories
        showTotalCalories : function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },

        addItemToForm:function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
        },

        //Delete item show
        deleteListItem : function(id) {
            const item = document.querySelector(`#item-${id}`);
            item.remove();
        },

        //Clear ListItems
        clearListItems : function() {
            let listItem = document.querySelectorAll(UISelectors.itemList);
            //Turn to Array
            listItem = Array.from(listItem);

            listItem.forEach(item => {
                item.remove();
            });
        }

    }
})();


//App Controler
const App = (function(ItemCtrl , UICtrl  , LocalStorageCtrl) {
    
    //Load events
    const loadEventListeners = function() {

    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    //Disabel enter event submt
    document.addEventListener('keypress' , function(e) {
        if(e.keyCode === 13 & e.which === 13) {
                e.preventDefault();
                return false;
        }
    });

    //Add event listners
    document.querySelector(UISelectors.addBtn).addEventListener('click' , itemSubmit);

    document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);

    //Update btn submit
    document.querySelector(UISelectors.updateBtn).addEventListener('click' , updateSubmit);

    //Back btn event
    document.querySelector(UISelectors.backBtn).addEventListener('click' , UICtrl.clearEditState);
    
    //Delete submit
    document.querySelector(UISelectors.deleteBtn).addEventListener('click' , deleteItemSubmit);

    //Clear all items
    document.querySelector(UISelectors.clearBtn).addEventListener('click' , clearAllItems);

    }

    //Clear Items
    const clearAllItems = function(e) {
        //Clear Items
        ItemCtrl.clearItems();
        
        //Clear form local storage
        LocalStorageCtrl.clearItemsLocalStorage();

        
       //Get totla calories
       const totalcalories = ItemCtrl.getTotalCalories();
       //show total calories
       UICtrl.showTotalCalories(totalcalories);
        
        //Clear list items
        UICtrl.clearListItems();
        e.preventDefault();
    }

    //Delete item submit
    const deleteItemSubmit = function(e) {
        //Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete item
        ItemCtrl.delteItem(currentItem.id);

        //Show in UI
        UICtrl.deleteListItem(currentItem.id);

          //Get totla calories
        const totalcalories = ItemCtrl.getTotalCalories();
        //show total calories
        UICtrl.showTotalCalories(totalcalories);
        //clear input
        UICtrl.clearInputs();

        //Delete from local storage
        LocalStorageCtrl.deleteItemLocalStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    //Update submit
    const updateSubmit = function(e) {
        //Get inputs
        const input = UICtrl.getItemInput();

        //Update data
        const updatedItem = ItemCtrl.updateItem(input.name , input.calories);

        //console.log(updatedItem);
        UICtrl.updateItem(updatedItem);

        //Get totla calories
        const totalcalories = ItemCtrl.getTotalCalories();
        //show total calories
        UICtrl.showTotalCalories(totalcalories);

        UICtrl.clearEditState();
        //update from local storage
        LocalStorageCtrl.updatedItemLocalStorage(updatedItem);

        //clear input
        UICtrl.clearInputs();

        e.preventDefault();
    }

    //Item update click
    const itemEditClick = function(e) {
        if(e.target.classList.contains('edit-item')) {

           const currentElementId = e.target.parentNode.parentNode.id;
           const toArrayId = currentElementId.split('-');
           const id = parseInt(toArrayId[1]);

           //Get item by id
           const currentItem = ItemCtrl.getItemById(id);
           ItemCtrl.setCurrentItem(currentItem);
            //Set name and calories
            UICtrl.addItemToForm();
            //Update edit state
           UICtrl.updateEditState();
        }
        e.preventDefault();
    }

    //Add item submit
    const itemSubmit = function(e) {
        
        //Get inputs
        const input = UICtrl.getItemInput();

        if(input.name !== '' && input.calories !== ' ') {
          //Add item  
          const newItem =  ItemCtrl.addItem(input.name , input.calories);
          //insert item into lliList
          UICtrl.addListItem(newItem);
          
          //Get totla calories
          const totalcalories = ItemCtrl.getTotalCalories();
          //show total calories
          UICtrl.showTotalCalories(totalcalories);
        }
        e.preventDefault();
    }



    //Public method
    return {
        init : function() {

            //Clear edit state
            UICtrl.clearEditState();

            //Get data structure
            const items = ItemCtrl.getItems();

             //Populate data
             UICtrl.populateItemList(items);

             //Get totla calories
             const totalcalories = ItemCtrl.getTotalCalories();
             //show total calories
             UICtrl.showTotalCalories(totalcalories);


             //Load events
             loadEventListeners();
        }
    }

})(ItemCtrl , UICtrl , LocalStorageCtrl);

App.init();