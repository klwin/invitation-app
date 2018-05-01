function supportsLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}
function getRecentSearches() {
  var searches = localStorage.getItem('recentSearches');
  if (searches) {
    return JSON.parse(searches);
  } else {
    return [];
  }
}

function saveSearchString(str) {
  var searches = getRecentSearches();
  if (!str || searches.indexOf(str) > -1) {
    return false;
  }
  searches.push(str);
  localStorage.setItem('recentSearches', JSON.stringify(searches));
  return true;
}

document.addEventListener('DOMContentLoaded', () => {
  if (supportsLocalStorage ()) {
    const form = document.getElementById('registrar');
    const input = form.querySelector('input');
    
    const mainDiv = document.querySelector('.main');
    const ul = document.getElementById('invitedList');
    
    const div = document.createElement('div');
    const filterLabel = document.createElement('label');
    const filterCheckBox = document.createElement('input');
    
    filterLabel.textContent = "Hide those who haven't responded";
    filterCheckBox.type = 'checkbox';
    div.appendChild(filterLabel);
    div.appendChild(filterCheckBox);
    mainDiv.insertBefore(div, ul);
    filterCheckBox.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      const lis = ul.children;
      if (isChecked) {
        for (let i = 0; i < lis.length; i += 1) {
          let li = lis[i];
          if (li.className === 'responded') {
            li.style.display = '';
            li.querySelector('label').style.display = 'none';
          } else {
            li.style.display = 'none';
          }
        }
      } else {
        for (let i = 0; i < lis.length; i += 1) {
          let li = lis[i];
          li.style.display = '';
          li.querySelector('label').style.display = '';
        }
      }
    });
  
    function createLI(text) {
      function createElement(elementName, property, value) {
        const element = document.createElement(elementName);
        element[property] = value;
        return element;
      }
      
      function appendToLI(elementName, property, value) {
        const element = createElement(elementName, property, value);
        li.appendChild(element);
        return element;
      }
      
      const li = document.createElement('li');
      appendToLI('span', 'textContent', text);
      appendToLI('label', 'textContent', 'Confirm:')
        .appendChild(createElement('input', 'type', 'checkbox'));
      appendToLI('button', 'textContent', 'edit');
      appendToLI('button', 'textContent', 'remove');
      appendToLI('textarea', 'placeholder', 'Notes');
      return li;
    }
  
    function checkDuplicates (name, element) {
      const lis = element;
      for (let i = 0; i < lis.length; i += 1) {
        if (name === lis[i].firstElementChild.textContent) {
          return true;
          break;
        }
      }
      return false;
    }
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value === '') {
        alert("The name is blank");
      } else if (checkDuplicates(input.value, ul.children)) {
        alert(input.value + " is already in the list");
      }else {
        const text = input.value;
        input.value = '';
        if (saveSearchString(text)) {
          const li = createLI(text);
          ul.appendChild(li);
        }
      }
    });
    
    ul.addEventListener('change', (e) => {
      const checkbox = event.target;
      const checked = checkbox.checked;
      const listItem = checkbox.parentNode.parentNode;
      
      if (checked) {
        listItem.className = 'responded';
        checkbox.previousSibling.nodeValue = 'Confirmed';
      } else {
        listItem.className = '';
        checkbox.previousSibling.nodeValue = 'Confirm';
      }
    });
    
    ul.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const button = e.target;
        const li = button.parentNode;
        const ul = li.parentNode;
        const action = button.textContent;
        const nameActions = {
          remove :  () => {
            ul.removeChild(li);
          },
          edit : () => {
            const span = li.firstElementChild;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent;
            li.insertBefore(input, span);
            li.removeChild(span);
            button.textContent = 'save';
          },
          save : () => {
            const input = li.firstElementChild;
            const span = document.createElement('span');
            span.textContent = input.value;
            li.insertBefore(span, input);
            li.removeChild(input);
            button.textContent = 'edit';
          }
        };
      
        //Select and run action in button's name
        nameActions[action]();
      }
    });
  
    //Initialize from the storage if any are presented
    let array = getRecentSearches();
    for (let i=0; i<array.length; i++) {
      let li = createLI(array[i]);
      ul.appendChild(li);
      console.log(array[i]);
    }
  }
});