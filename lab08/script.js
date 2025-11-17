window.addEventListener("load", setup);

smartphone_url = new URL("http://localhost:8000/smartphones");

function setup() {
    create_DOM_references();
    add_event_listeners();
}

function create_DOM_references() {
    view_all_smartphones_button = document.getElementById("view_all_smartphones_button");
    output_window = document.getElementById("display_div_id");

    view_a_smartphone_button = document.getElementById("get_one_smartphone_button");
    one_smartphone_number_element = document.getElementById("smartphone_number_text_input");

    add_new_smartphone_button = document.getElementById("add_new_smartphone_button");
    brand_element = document.getElementById("insert_new_smartphone_brand_text_input");
    price_element = document.getElementById("insert_new_smartphone_price_text_input");
    screen_element = document.getElementById("insert_new_smartphone_screen_text_input");
    pixels_element = document.getElementById("insert_new_smartphone_pixels_text_input");
    resolution_element = document.getElementById("insert_new_smartphone_resolution_text_input");
    storage_element = document.getElementById("insert_new_smartphone_storage_text_input");
    ram_element = document.getElementById("insert_new_smartphone_ram_text_input");
    battery_element = document.getElementById("insert_new_smartphone_battery_text_input");
    weight_element = document.getElementById("insert_new_smartphone_weight_text_input");

    update_existing_smartphone_button = document.getElementById("update_existing_smartphone_button");
    smartphone_number_update_element = document.getElementById("update_existing_smartphone_number_text_input");
    brand_update_element = document.getElementById("update_existing_smartphone_brand_text_input");
    price_update_element = document.getElementById("update_existing_smartphone_price_text_input");
    screen_update_element = document.getElementById("update_existing_smartphone_screen_text_input");
    pixels_update_element = document.getElementById("update_existing_smartphone_pixels_text_input");
    resolution_update_element = document.getElementById("update_existing_smartphone_resolution_text_input");
    storage_update_element = document.getElementById("update_existing_smartphone_storage_text_input");
    ram_update_element = document.getElementById("update_existing_smartphone_ram_text_input");
    battery_update_element = document.getElementById("update_existing_smartphone_battery_text_input");
    weight_update_element = document.getElementById("update_existing_smartphone_weight_text_input");

    delete_smartphone_button = document.getElementById("delete_existing_smartphone_button");
    smartphone_number_delete_element = document.getElementById("delete_existing_smartphone_number_text_input");
}

function add_event_listeners() {
    view_all_smartphones_button.addEventListener("click", retrieve_and_display_all_smartphone_entries);
    view_a_smartphone_button.addEventListener("click", retrieve_and_display_one_smartphone_entry);

    add_new_smartphone_button.addEventListener("click", add_one_smartphone_entry);
    update_existing_smartphone_button.addEventListener("click", update_existing_smartphone);

    delete_smartphone_button.addEventListener("click", delete_existing_smartphone);
}

async function retrieve_and_display_all_smartphone_entries() {
    // issuing an HTTP Get request to get all the smartphones
    let smartphones = await http_get_request(smartphone_url);
    console.log(smartphones);

    // cleaning up the output display for the new data
    output_window.innerHTML = "";

    // looping over all the smartphones and creating the necessary HTML elements

    for (let smartphone of smartphones) {
        // div
        let div_element = document.createElement("div");

        // brand with ID
        let brand_element = document.createElement("h2");
        brand_element.innerText = `${smartphone.id} - ${smartphone.brand}`;

        // price
        let price_element = document.createElement("h3");
        price_element.innerText = `Price: ${smartphone.price}`;

        // appending to the div element
        div_element.append(brand_element, price_element);

        // appending the div into the output_window div
        output_window.append(div_element);
    }
}

async function retrieve_and_display_one_smartphone_entry() {
    // getting a hold on the smartphone_number input element
    let one_smartphone_number = one_smartphone_number_element.value;

    // issuing an HTTP Get Request with "/smartphone_number" added to the smartphone_url
    let smartphone = await http_get_request(`${smartphone_url}/${one_smartphone_number}`);


    // div
    let div_element = document.createElement("div");

    //    h2  brand
    let brand_element = document.createElement("h2");
    brand_element.innerText = `${smartphone.id} - ${smartphone.brand}`;

    //    h3  price
    let price_element = document.createElement("h3");
    price_element.innerText = `Price: ${smartphone.price}`;

    // creating paragraph elements for all features
    let screen_element = document.createElement("p");
    screen_element.innerText = `Screen: ${smartphone.screen}`;

    let pixels_element = document.createElement("p");
    pixels_element.innerText = `Pixels: ${smartphone.pixels}`;

    let resolution_element = document.createElement("p");
    resolution_element.innerText = `Resolution: ${smartphone.resolution}`;

    let storage_element = document.createElement("p");
    storage_element.innerText = `Storage: ${smartphone.storage}`;

    let ram_element = document.createElement("p");
    ram_element.innerText = `RAM: ${smartphone.ram}`;

    let battery_element = document.createElement("p");
    battery_element.innerText = `Battery: ${smartphone.battery}`;

    let weight_element = document.createElement("p");
    weight_element.innerText = `Weight: ${smartphone.weight}`;

    // appending the elements into the temp div
    div_element.append(brand_element, price_element, screen_element, pixels_element, 
                      resolution_element, storage_element, ram_element, battery_element, weight_element);

    // cleaning up the response window before adding new information
    output_window.innerHTML = "";
        
    // Appending the temporary div_element to the webpage output window div
    output_window.append(div_element);

    // cleaning up the smartphone number text input
    one_smartphone_number_element.value = "";
}

async function add_one_smartphone_entry() {
    // getting a hold of their values
    let brand = brand_element.value;
    let price = price_element.value;
    let screen = screen_element.value;
    let pixels = pixels_element.value;
    let resolution = resolution_element.value;
    let storage = storage_element.value;
    let ram = ram_element.value;
    let battery = battery_element.value;
    let weight = weight_element.value;

    // creating a smartphone object
    let new_smartphone = {
        "brand": brand,
        "price": price,
        "screen": screen,
        "pixels": pixels,
        "resolution": resolution,
        "storage": storage,
        "ram": ram,
        "battery": battery,
        "weight": weight
    }

    // issuing an HTTP Post Request
    await http_post_request(smartphone_url, new_smartphone);

    // Cleaning up the display area
    brand_element.value = "";
    price_element.value = "";
    screen_element.value = "";
    pixels_element.value = "";
    resolution_element.value = "";
    storage_element.value = "";
    ram_element.value = "";
    battery_element.value = "";
    weight_element.value = "";

    // cleaning up the output display for the new data
    output_window.innerHTML = "";
}

async function update_existing_smartphone() {
    // getting a hold of their values
    let smartphone_number = smartphone_number_update_element.value;
    let brand = brand_update_element.value;
    let price = price_update_element.value;
    let screen = screen_update_element.value;
    let pixels = pixels_update_element.value;
    let resolution = resolution_update_element.value;
    let storage = storage_update_element.value;
    let ram = ram_update_element.value;
    let battery = battery_update_element.value;
    let weight = weight_update_element.value;

    // create json object
    let update_fields = {};
    if (brand != "") {
        update_fields["brand"] = brand;
    }
    if (price != "") {
        update_fields["price"] = price;
    }
    if (screen != "") {
        update_fields["screen"] = screen;
    }
    if (pixels != "") {
        update_fields["pixels"] = pixels;
    }
    if (resolution != "") {
        update_fields["resolution"] = resolution;
    }
    if (storage != "") {
        update_fields["storage"] = storage;
    }
    if (ram != "") {
        update_fields["ram"] = ram;
    }
    if (battery != "") {
        update_fields["battery"] = battery;
    }
    if (weight != "") {
        update_fields["weight"] = weight;
    }

    await http_patch_request(`${smartphone_url}/${smartphone_number}`, update_fields);

    // cleaning up the input fields
    smartphone_number_update_element.value = "";
    brand_update_element.value = "";
    price_update_element.value = "";
    screen_update_element.value = "";
    pixels_update_element.value = "";
    resolution_update_element.value = "";
    storage_update_element.value = "";
    ram_update_element.value = "";
    battery_update_element.value = "";
    weight_update_element.value = "";

    // cleaning up the output display from old results
    output_window.innerHTML = "";
}

async function delete_existing_smartphone() {
    // getting the number of the smartphone to be deleted
    let smartphone_number = smartphone_number_delete_element.value;

    // issuing a delete request for that given smartphone number
    await http_delete_request(`${smartphone_url}/${smartphone_number}`);

    // Cleaning the smartphone number text field
    smartphone_number_delete_element.value = "";

    // cleaning up the output display for the new data
    output_window.innerHTML = "";
}

// HTTP Request Functions
async function http_get_request(url) {
    return await fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => console.error('Error:', error));
}

async function http_post_request(url, new_smartphone) {
    return await fetch(url, {
        method: 'POST',
        body: JSON.stringify(new_smartphone),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })
        .catch(error => console.error('Error:', error));
}

async function http_patch_request(url, updated_field) {
    return await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(updated_field),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })
        .catch(error => console.error('Error:', error));
}

async function http_delete_request(url) {
    return await fetch(url, {
        method: 'DELETE'
    })
        .catch(error => console.error('Error:', error));
}