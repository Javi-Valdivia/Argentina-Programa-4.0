const flightNumbers = [1770, 1771, 1772, 1773];

function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
}

async function fetchData(flightNumber) {
    const currentDate = getCurrentDate();
    const url = `https://www.aerolineas.com.ar/flight-status?departureDate=${currentDate}&flightNumber=${flightNumber}`;

    try {
        const response = await fetch(url);
        const html = await response.text();

        // Wait for 550ms before processing the HTML
        await new Promise(resolve => setTimeout(resolve, 60550));

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // TODO: Extract the required information from the HTML document
        const airlineNameElement = doc.querySelector(".fs-airline-name");
        const flightStatusElement = doc.querySelector(".c-message-title");
        const originAirportElement = doc.querySelector(".fs-from-airport");
        const originCityElement = doc.querySelector(".fs-from-city");
        const destinationAirportElement = doc.querySelector(".fs-to-airport");
        const destinationCityElement = doc.querySelector(".fs-to-city");
        const departureTimeElement = doc.querySelector(".fs-status-from-box .fs-status-hour");
        const arrivalTimeElement = doc.querySelector(".fs-status-to-box .fs-status-hour");

        const airlineName = airlineNameElement ? airlineNameElement.textContent.trim() : 'N/A';
        const flightStatus = flightStatusElement ? flightStatusElement.textContent.trim() : 'N/A';
        const originAirport = originAirportElement ? originAirportElement.textContent.trim() : 'N/A';
        const originCity = originCityElement ? originCityElement.textContent.trim() : 'N/A';
        const destinationAirport = destinationAirportElement ? destinationAirportElement.textContent.trim() : 'N/A';
        const destinationCity = destinationCityElement ? destinationCityElement.textContent.trim() : 'N/A';
        const departureTime = departureTimeElement ? departureTimeElement.textContent.trim() : 'N/A';
        const arrivalTime = arrivalTimeElement ? arrivalTimeElement.textContent.trim() : 'N/A';

        const flightData = {
            flightNumber,
            airlineName,
            originCity,
            destinationCity,
            departureTime,
            arrivalTime,
            flightStatus
        };

        return flightData;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

function createTableCell(content) {
    const cell = document.createElement("td");
    cell.textContent = content;
    return cell;
}

async function updateTable() {
    const tableBody = document.querySelector("#flight-status tbody");
    tableBody.innerHTML = "";

    for (const flightNumber of flightNumbers) {
        const flightData = await fetchData(flightNumber);

        if (flightData) {
            const row = document.createElement("tr");

            row.appendChild(createTableCell(flightData.flightNumber));
            row.appendChild(createTableCell(flightData.airlineName));
            row.appendChild(createTableCell(flightData.originCity));
            row.appendChild(createTableCell(flightData.destinationCity));
            row.appendChild(createTableCell(flightData.departureTime));
            row.appendChild(createTableCell(flightData.arrivalTime));
            row.appendChild(createTableCell(flightData.flightStatus));

            tableBody.appendChild(row);
        }
    }
}

// Run the updateTable function every 10 minutes
setInterval(updateTable, 10 * 60 * 1000);

// Initial update
updateTable();
