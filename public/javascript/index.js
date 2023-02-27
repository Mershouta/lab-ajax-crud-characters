
/**
 * You might want to use this template to display each new characters
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template#examples
 */

const characterTemplate = document.querySelector('#template');
const charactersContainer = document.querySelector(".characters-container");
const fetchAllBtn = document.querySelector('#fetch-all');

const findByIdInput = document.querySelector("[name=character-id]");
const fetchOneBtn = document.querySelector('#fetch-one');

const deleteByIdInput = document.querySelector("[name=character-id-delete]");
const deleteBtn = document.querySelector("#delete-one");

const addForm = document.querySelector("#new-character-form");
const addNameInput = addForm.querySelector("[name=name]");
const addOccupationInput = addForm.querySelector("[name=occupation]");
const addWeaponInput = addForm.querySelector("[name=weapon]");
const addCartoonInput = addForm.querySelector("[name=cartoon]");
const addBtn = addForm.querySelector("#send-data");

const updateForm = document.querySelector("#edit-character-form");
const updateIdInput = updateForm.querySelector("[name=chr-id]");
const updateNameInput = updateForm.querySelector("[name=name]");
const updateOccupationInput = updateForm.querySelector("[name=occupation]");
const updateWeaponInput = updateForm.querySelector("[name=weapon]");
const updateCartoonInput = updateForm.querySelector("[name=cartoon]");
const updateBtn = updateForm.querySelector("#send-data");

const characterApi = axios.create({
  baseURL: 'http://localhost:5005/api/characters',
});


fetchAllBtn.addEventListener('click', fetchAll);

fetchOneBtn.addEventListener('click', fetchOne);

deleteBtn.addEventListener('click', deleteOne);

updateForm.addEventListener('submit', editOne);

addForm.addEventListener('submit', addOne);



async function fetchAll(event) {
  try {
    const { data } = await characterApi.get();

    changeBtnColor(fetchAllBtn);

    charactersContainer.innerHTML = '';
    for (const character of data) {
      createCharacter(character);
    }
  } catch (error) {
    console.error(error);

    changeBtnColor(fetchAllBtn, false);
  }
};

async function fetchOne(event) {
  try {
    if (!findByIdInput.value.trim()) { // for when the input is empty or has only spaces
      return changeBtnColor(fetchOneBtn, false);
    }

    const { data: character } = await characterApi.get(`/${findByIdInput.value}`);

    changeBtnColor(fetchOneBtn);

    charactersContainer.innerHTML = '';
    createCharacter(character);
  } catch (error) {
    console.error(error);

    changeBtnColor(fetchOneBtn, false);
  }
}

async function deleteOne(event) {
  try {
    event.preventDefault();
    await characterApi.delete(`/${deleteByIdInput.value}`);

    changeBtnColor(deleteBtn);
    fetchAll();
  } catch (error) {
    console.error(error);

    changeBtnColor(deleteBtn, false);
  }
}

async function editOne(event) {
  try {
    event.preventDefault();
    await characterApi.patch(
      `/${updateIdInput.value}`,
      {
        name: updateNameInput.value,
        occupation: updateOccupationInput.value,
        weapon: updateWeaponInput.value,
        cartoon: updateCartoonInput.checked
      }
    );

    changeBtnColor(updateBtn);
    fetchAll();
  } catch (error) {
    console.error(error);

    changeBtnColor(updateBtn, false);
  }
}

async function addOne(event) {
  try {
    event.preventDefault();
    const { data: character } = await characterApi.post(
      "/",
      {
        name: addNameInput.value,
        occupation: addOccupationInput.value,
        weapon: addWeaponInput.value,
        cartoon: addCartoonInput.checked,
      }
    );

    changeBtnColor(addBtn);
    fetchAll();
  } catch (error) {
    console.log(error);

    changeBtnColor(addBtn, false);
  }
}


function createCharacter(character) {
  const clone = characterTemplate.content.cloneNode(true);
  clone.querySelector('.character-id span').textContent = character._id;
  clone.querySelector('.name span').textContent = character.name;
  clone.querySelector('.occupation span').textContent = character.occupation;
  clone.querySelector('.cartoon span').textContent = character.cartoon;
  clone.querySelector('.weapon span').textContent = character.weapon;

  charactersContainer.append(clone);
}

function changeBtnColor(btnElement, success = true) {
  btnElement.style.backgroundColor = success ? "green" : "red";
  setTimeout(() => {
    btnElement.style.backgroundColor = null;
  }, 400);
}
