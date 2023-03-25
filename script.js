"use strict";

const billInput = document.getElementById("bill");
const peopleInput = document.getElementById("people");
const tipInput = document.getElementById("tip-input");
const tipBtns = document.querySelectorAll(".tip-btn");
const tipPrice = document.getElementById("tip-price");
const totalPrice = document.getElementById("total-price");
const resetBtn = document.querySelector(".reset-btn");

const tipBtnSelectedClass = "tip-btn--selected";

let currentTipPercentage, currentTotal, currentPeople, currentBill;

// Remove selected class from previously-selected tip buttonm if one exists
const unselectPrevTipBtn = function () {
    const prevSelection = document.querySelector(`.${tipBtnSelectedClass}`);
    if (prevSelection) prevSelection.classList.remove(tipBtnSelectedClass);
};

// Unselect previous tip button selection and set new selection
const selectTipBtn = function (e) {
    unselectPrevTipBtn();
    e.target.classList.add(tipBtnSelectedClass);
};

// Unselect previous tip button selection
const selectTipInput = function (e) {
    unselectPrevTipBtn();
};

// Update number of people based on user input
const updatePeople = function (e) {
    const newValue = Number(e.target.value);
    if (!newValue || !Number.isInteger(newValue)) {
        console.log("Not a valid input!");
        return;
    }
    currentPeople = newValue;
};

const isValidCurrencyString = function (value) {
    // throw error if param is not a string
    if (typeof value !== "string") {
        throw new Error("Parameter is not a string.");
    }

    // Return false if given falsy value
    if (!value) return false;

    // Return false if string contains characters besides numbers, commas, and periods
    // There must be only one comma or period, representing decimal in number
    const pattern = new RegExp("^[0-9]+[\\.,]?[0-9]*$");
    if (!pattern.test(value)) return false;

    return true;
};

// Update value of bill based on user input
const updateBill = function (e) {
    const newValue = e.target.value;
    try {
        isValidCurrencyString(newValue);
    } catch (error) {
        console.error(error);
    }
};

const init = function () {
    currentTipPercentage = 0;
    currentTotal = 0;
    currentPeople = 0;
    currentBill = 0;
    resetBtn.disabled = true;
    billInput.value = "";
    tipInput.value = "";
    peopleInput.value = "";
    tipPrice.textContent = "$0.00";
    totalPrice.textContent = "$0.00";
    unselectPrevTipBtn();
};

// Initialize starting values and state
init();

// Add event handlers
for (const tipBtn of tipBtns) {
    tipBtn.addEventListener("click", selectTipBtn);
}

tipInput.addEventListener("focus", selectTipInput);
tipInput.addEventListener("input", selectTipInput);

peopleInput.addEventListener("input", updatePeople);

billInput.addEventListener("input", updateBill);
