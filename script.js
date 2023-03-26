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

const validTipBtnPercentages = [5, 10, 15, 25, 50];

// Keeps track of values input by user
const currentState = {
    tipPercentage: 0,
    bill: 0,
    people: 0,
};

// Removes styles from previously-selected tip button, if one exists
const unselectPrevTipBtn = function () {
    const prevSelection = document.querySelector(`.${tipBtnSelectedClass}`);
    if (prevSelection) prevSelection.classList.remove(tipBtnSelectedClass);
};

// Returns true if current state contains all the necessary values for calculating Tip Amount and Total
const canCalculateResults = function () {
    return currentState.bill && currentState.people; // must be non-zero
};

// Calculates tip (per person) and total (per person) based on stored user input
const calculateResults = function () {
    // calculate monetary values using integer cent values to avoid issues with floating point math
    const billInCents = currentState.bill * 100;
    const tipInCents =
        Math.round(billInCents * currentState.tipPercentage) / 100;
    const totalInCents = Math.round(billInCents + tipInCents);
    // divide cent values by 100 to convert to dollars
    return {
        tipPerPerson: Math.round(tipInCents / currentState.people) / 100,
        totalPerPerson: Math.round(totalInCents / currentState.people) / 100,
    };
};

// Replaces displayed Tip Amount and Total results with text that signifies "no value", and disables reset button
const removeDisplayedResults = function () {
    tipPrice.textContent = "-";
    totalPrice.textContent = "-";
    resetBtn.disabled = true;
};

/* 
Calculates and displays values for Tip Amount and Total on UI. 
If calculation conditions are not met, display result prices to indicate no value
*/
const updateDisplayedResults = function () {
    if (canCalculateResults()) {
        const { tipPerPerson, totalPerPerson } = calculateResults();
        tipPrice.textContent = `$${tipPerPerson.toFixed(2)}`;
        totalPrice.textContent = `$${totalPerPerson.toFixed(2)}`;
    } else {
        removeDisplayedResults();
    }
};

/* 
Updates warning message visibility, state variables, and displayed results
based on validity of user input (as determined by pattern matches in HTML)
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
        // reset relevant state variable to initial state
        currentState[stateVar] = 0;
        // display result prices to indicate no value
        removeDisplayedResults();
    } else {
        // if valid, hide warning if one exists
        if (warningElem) warningElem.classList.add("hidden");
        //update relevant state variable based on user input
        const formattedUserInput = removeCommas(input.value);
        currentState[stateVar] = Number(formattedUserInput) || 0;
        // calculate and display new tip and total on ui
        updateDisplayedResults();
    }
};

/* 
Formats user input string so that it can be parsed as a number 
regardless if the string uses commas to denote decimals or express thousands
*/
const removeCommas = function (userInput) {
    const thousandsRegex = /,(\d{3})/g;
    const decimalRegex = /,(\d{2})/g;
    return userInput.replace(thousandsRegex, "$1").replace(decimalRegex, ".$1");
};
// Updates tip button styles based on user selection, clears tip input, and updates state variable and calculated results
const selectTipBtn = function (e) {
    // remove styles from previously-selected button and add to newly-selected button
    unselectPrevTipBtn();
    e.target.classList.add(tipBtnSelectedClass);
    // clear tip input
    tipInput.value = "";
    // update state variable with new tip percentage if valid. otherwise, throw error
    currentState.tipPercentage = Number(e.target.dataset.tipPercentage);
    if (!validTipBtnPercentages.includes(currentState.tipPercentage))
        throw new Error(
            `Invalid tip percentage: ${currentState.tipPercentage}`
        );
    // calculate and display new tip and total on ui
    updateDisplayedResults();
};

// Removes styles from previously-selected tip button if one exists, and updates state variable and calculated results
const selectTipInput = function (e) {
    unselectPrevTipBtn();
    updateBasedOnInputValidity({
        input: tipInput,
        stateVar: "tipPercentage",
    });
};

// Initializes starting values and state
const init = function () {
    currentState.tipPercentage = 0;
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
    tipBtn.addEventListener("click", (e) => {
        try {
            selectTipBtn(e);
        } catch (error) {
            console.error(error);
        }
    });
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
