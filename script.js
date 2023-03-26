"use strict";

const billInput = document.getElementById("bill");
const peopleInput = document.getElementById("people");
const tipInput = document.getElementById("tip-input");
const tipBtns = document.querySelectorAll(".tip-btn");
const tipPrice = document.getElementById("tip-price");
const totalPrice = document.getElementById("total-price");
const resetBtn = document.querySelector(".reset-btn");
const peopleWarning = document.getElementById("people-warning");
const billWarning = document.getElementById("bill-warning");

const tipBtnSelectedClass = "tip-btn--selected";

const currentState = {
    tipPercentage: 0,
    total: 0,
    people: 0,
    bill: 0,
};

// Remove selected class from previously-selected tip button, if one exists
const unselectPrevTipBtn = function () {
    const prevSelection = document.querySelector(`.${tipBtnSelectedClass}`);
    if (prevSelection) prevSelection.classList.remove(tipBtnSelectedClass);
};

// Update styles for previous and current selections, and update state variable and results
const selectTipBtn = function (e) {
    unselectPrevTipBtn();
    // add styles to selected button
    e.target.classList.add(tipBtnSelectedClass);
    // update state var for tip percentage
    currentState.tipPercentage = e.target.dataset.tipPercentage;
};

// Update styles for previous selection, and update state variable and results
const selectTipInput = function (e) {
    unselectPrevTipBtn();
    updateBasedOnInputValidity({
        input: tipInput,
        stateVar: "tipPercentage",
    });
};

/* 
Updates visibility of warning messages, value of state variables, and displayed results
based on validity of the user input as determined through pattern matches in HTML
*/
const updateBasedOnInputValidity = function ({
    input,
    warningElem = null,
    stateVar,
}) {
    // ensure reset button is enabled
    resetBtn.disabled = false;
    if (!input.checkValidity()) {
        // if invalid, show warning if one exists
        if (warningElem) warningElem.classList.remove("hidden");
        // update relevant state variable to initial state
        currentState[stateVar] = 0;
        // display result prices as to indicate no value
        tipPrice.textContent = "-";
        totalPrice.textContent = "-";
    } else {
        // if valid, hide warning if one exists
        if (warningElem) warningElem.classList.add("hidden");
        //update relevant state variable to user-defined state
        currentState[stateVar] = input.value || 0;
        // display updated result prices
        tipPrice.textContent = "$0.00";
        totalPrice.textContent = "$0.00";
    }
};

// Initializes starting values and state
const init = function () {
    currentState.tipPercentage = 0;
    currentState.total = 0;
    currentState.people = 0;
    currentState.bill = 0;
    resetBtn.disabled = true;
    billInput.value = "";
    tipInput.value = "";
    peopleInput.value = "";
    tipPrice.textContent = "$0.00";
    totalPrice.textContent = "$0.00";
    unselectPrevTipBtn();
};

init();

for (const tipBtn of tipBtns) {
    tipBtn.addEventListener("click", selectTipBtn);
}
tipInput.addEventListener("focus", selectTipInput);
tipInput.addEventListener("input", selectTipInput);

peopleInput.addEventListener("input", () => {
    updateBasedOnInputValidity({
        input: peopleInput,
        warningElem: peopleWarning,
        stateVar: "people",
    });
});

billInput.addEventListener("input", () => {
    updateBasedOnInputValidity({
        input: billInput,
        warningElem: billWarning,
        stateVar: "bill",
    });
});

resetBtn.addEventListener("click", init);
