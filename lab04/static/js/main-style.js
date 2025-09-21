function main_driver() {
    let loanInformation = getLoanInformation();  // [housePrice, downpayment, annual interest rate, number of years]
    let loanEquationParameters = getLoanEquationParameters(loanInformation); // [p,r,n]
    let m = computeMontlyMortgagePayments(loanEquationParameters);
    displayResults(loanInformation, loanEquationParameters, m);
    plotMortgageCurves(loanInformation, loanEquationParameters, m);
}

function getLoanInformation() {
    //added 
    let housePrice = 600000;
    let downPayment = 100000;
    let annualInterestRate = 0.05; 
    let periodInYears = 30;

    return [housePrice, downPayment, annualInterestRate, periodInYears];
}

function getLoanEquationParameters(loanInformation) {
    //added 
    let housePrice = loanInformation[0];
    let downPayment = loanInformation[1];
    let annualRate = loanInformation[2];
    let years = loanInformation[3];

    let p = housePrice - downPayment;      // loan principal
    let r = annualRate / 12;              // monthly interest rate
    let n = years * 12;                   // total number of payments
 
    return [p, r, n];
}

function computeMontlyMortgagePayments(loanEquationParameters) {
    //added
    let p = loanEquationParameters[0];
    let r = loanEquationParameters[1];
    let n = loanEquationParameters[2];

    let m = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return m;
}

function displayResults(loanInformation, loanEquationParameters, m) {
    let [housePrice, downPayment, annualInterestRate, periodInYears] = loanInformation;
    let [p, r, n] = loanEquationParameters;

    // income rule: assume 30% max of monthly income can go to mortgage
    let minMonthlyIncome = (m / 0.30);  

    let resultsDiv = document.createElement("div");
    resultsDiv.innerHTML = `
        <h2>Mortgage Calculator</h2>
        <p><strong>House Price:</strong> $${housePrice.toLocaleString()}</p>
        <p><strong>Down Payment:</strong> $${downPayment.toLocaleString()}</p>
        <p><strong>Principal:</strong> $${p.toLocaleString()}</p>
        <p><strong>Annual Interest Rate:</strong> ${(annualInterestRate * 100).toFixed(2)}%</p>
        <p><strong>Loan Period:</strong> ${periodInYears} years</p>
        <p><strong>Monthly Mortgage Payments:</strong> $${m.toFixed(2)} per month</p>
        <p><strong>Minimum Monthly Income per Household:</strong> $${minMonthlyIncome.toFixed(2)} (30% of the house income)</p>
    `;
    document.body.appendChild(resultsDiv);
}

function plotMortgageCurves(loanInformation, loanEquationParameters, m) {
    let plottingArrays = getLoanPaymentValues(loanInformation, loanEquationParameters,
        m);
    plotValues(plottingArrays);
}

function getLoanPaymentValues(loanInformation, loanEquationParameters, m) {
    // added 
    let [p, r, n] = loanEquationParameters;

    let balance = p;
    let xArray = [];                          // months
    let monthlyInterestPaymentValues = [];    // interest payments
    let monthlyPrincipalPaymentValues = [];   // principal payments
    let monthlyPrincipalValues = [];          // remaining balance

    for (let month = 1; month <= n; month++) {
        let interestPayment = balance * r;
        let principalPayment = m - interestPayment;
        balance -= principalPayment;

        if (balance < 0) balance = 0; // avoid negatives at end

        xArray.push(month);
        monthlyInterestPaymentValues.push(interestPayment);
        monthlyPrincipalPaymentValues.push(principalPayment);
        monthlyPrincipalValues.push(balance);
    }

    return [xArray, monthlyInterestPaymentValues, monthlyPrincipalPaymentValues,
        monthlyPrincipalValues];
}

function plotValues(plottingArrays) {
    let [xArray, monthlyInterestPaymentValues, monthlyPrincipalPaymentValues, monthlyPrincipalValues] = plottingArrays;

    let trace1 = {
        x: xArray,
        y: monthlyInterestPaymentValues,
        name: "Interest Portion",
        mode: "lines",
        line: { color: "blue" }
    };
    let trace2 = {
        x: xArray,
        y: monthlyPrincipalPaymentValues,
        name: "Principal Portion",
        mode: "lines",
        line: { color: "orange" }
    };
    let layout1 = {
        title: "Mortgage Payments",
        xaxis: { title: "Number of Months" },
        yaxis: { title: "Dollars ($)" },
        showlegend: false   
    };
    Plotly.newPlot("monthlyInterestRateAndPrincipalPayments", [trace1, trace2], layout1);

    let trace3 = {
        x: xArray,
        y: monthlyPrincipalValues,
        name: "Remaining Balance",
        mode: "lines",
        line: { color: "blue" }
    };
    let layout2 = {
        title: "Mortgage Payments",
        xaxis: { title: "Number of Months" },
        yaxis: { title: "Dollars ($)" }
    };
    Plotly.newPlot("monthlyPrincipalValues", [trace3], layout2);
}