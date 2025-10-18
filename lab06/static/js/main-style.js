window.addEventListener("load", setup);

function setup() {
  let computeButton = document.getElementById("computeButton");
  computeButton.addEventListener("click", compute_mortgage);

  let resetButton = document.getElementById("resetButton");
  resetButton.addEventListener("click", reset);
}

function compute_mortgage() {
  let loanInformation = getLoanInformation();
  let loanEquationParameters = getLoanEquationParameters(loanInformation);
  let m = computeMontlyMortgagePayments(loanEquationParameters);
  displayResults(loanInformation, loanEquationParameters, m);
  plotMortgageCurves(loanInformation, loanEquationParameters, m);
}

function getLoanInformation() {
  let housePrice = parseFloat(document.getElementById("housePrice").value);
  let downPayment = parseFloat(document.getElementById("downPayment").value);
  let annualInterestRate =
    parseFloat(document.getElementById("annualInterestRate").value) / 100;
  let periodInYears = parseInt(
    document.getElementById("mortgageDuration").value
  );

  return [housePrice, downPayment, annualInterestRate, periodInYears];
}

function getLoanEquationParameters(loanInformation) {
  let housePrice = loanInformation[0];
  let downPayment = loanInformation[1];
  let annualRate = loanInformation[2];
  let years = loanInformation[3];

  let p = housePrice - downPayment;
  let r = annualRate / 12;
  let n = years * 12;

  return [p, r, n];
}

function computeMontlyMortgagePayments(loanEquationParameters) {
  let p = loanEquationParameters[0];
  let r = loanEquationParameters[1];
  let n = loanEquationParameters[2];

  let m = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return m;
}

function displayResults(loanInformation, loanEquationParameters, m) {
  let [housePrice, downPayment, annualInterestRate, periodInYears] =
    loanInformation;
  let [p, r, n] = loanEquationParameters;

  let minMonthlyIncome = m / 0.3;

  let resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = `
                <h2>Mortgage Calculator</h2>
                <p><strong>House Price:</strong> $${housePrice.toLocaleString()}</p>
                <p><strong>Down Payment:</strong> $${downPayment.toLocaleString()}</p>
                <p><strong>Principal:</strong> $${p.toLocaleString()}</p>
                <p><strong>Annual Interest Rate:</strong> ${(
                  annualInterestRate * 100
                ).toFixed(2)}%</p>
                <p><strong>Loan Period:</strong> ${periodInYears} years</p>
                <p><strong>Monthly Mortgage Payments:</strong> $${m.toFixed(
                  2
                )} per month</p>
                <p><strong>Minimum Monthly Income per Household:</strong> $${minMonthlyIncome.toFixed(
                  2
                )} (30% of the house income)</p>
            `;
}

function plotMortgageCurves(loanInformation, loanEquationParameters, m) {
  let plottingArrays = getLoanPaymentValues(
    loanInformation,
    loanEquationParameters,
    m
  );
  plotValues(plottingArrays);
}

function getLoanPaymentValues(loanInformation, loanEquationParameters, m) {
  let [p, r, n] = loanEquationParameters;

  let balance = p;
  let xArray = [];
  let monthlyInterestPaymentValues = [];
  let monthlyPrincipalPaymentValues = [];
  let monthlyPrincipalValues = [];

  for (let month = 1; month <= n; month++) {
    let interestPayment = balance * r;
    let principalPayment = m - interestPayment;
    balance -= principalPayment;

    if (balance < 0) balance = 0;

    xArray.push(month);
    monthlyInterestPaymentValues.push(interestPayment);
    monthlyPrincipalPaymentValues.push(principalPayment);
    monthlyPrincipalValues.push(balance);
  }

  return [
    xArray,
    monthlyInterestPaymentValues,
    monthlyPrincipalPaymentValues,
    monthlyPrincipalValues,
  ];
}

function plotValues(plottingArrays) {
  let [
    xArray,
    monthlyInterestPaymentValues,
    monthlyPrincipalPaymentValues,
    monthlyPrincipalValues,
  ] = plottingArrays;

  let trace1 = {
    x: xArray,
    y: monthlyInterestPaymentValues,
    name: "Interest Portion",
    mode: "lines",
    line: { color: "blue" },
  };
  let trace2 = {
    x: xArray,
    y: monthlyPrincipalPaymentValues,
    name: "Principal Portion",
    mode: "lines",
    line: { color: "orange" },
  };
  let layout1 = {
    title: "Mortgage Payments",
    xaxis: { title: "Number of Months" },
    yaxis: { title: "Dollars ($)" },
    showlegend: true,
  };
  Plotly.newPlot(
    "monthlyInterestRateAndPrincipalPayments",
    [trace1, trace2],
    layout1
  );

  let trace3 = {
    x: xArray,
    y: monthlyPrincipalValues,
    name: "Remaining Balance",
    mode: "lines",
    line: { color: "blue" },
  };
  let layout2 = {
    title: "Principal Value Over Time",
    xaxis: { title: "Number of Months" },
    yaxis: { title: "Dollars ($)" },
  };
  Plotly.newPlot("monthlyPrincipalValues", [trace3], layout2);
}

function reset() {
  document.getElementById("results").innerHTML = "";
  document.getElementById("monthlyInterestRateAndPrincipalPayments").innerHTML =
    "";
  document.getElementById("monthlyPrincipalValues").innerHTML = "";
}
