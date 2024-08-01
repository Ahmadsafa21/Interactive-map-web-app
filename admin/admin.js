var formText = `
		<form id="markerForm">
		<div class="form-group">
			<label for="name">Marker Name:</label>
			<input type="text" id="name" name="name" required>
		</div>
		<div class="form-group">
			<label for="position">Marker Position:</label>
			<input type="text" id="position" name="position" required>
		</div>
		<div class="form-group">
			<label for="aliases">Aliases (for searching):</label>
			<input type="text" id="aliases" name="aliases" required>
		</div>
		<div class="form-group">
			<label for="content">Content:</label>
			<textarea id="content" name="content" rows="10" cols="50" required></textarea>
		</div>
		<div class="form-group">
			<button type="submit">Submit</button>
		</div>
	</form>
`;
// import markers.json
// iterate through
	// set text elements, default values in formtext
	// add to resultText
// add final stuff to resultText (submit button)
// apply


async function setForm() {
	document.getElementById("adminBox").innerHTML = formText

	document.querySelector("form").addEventListener("submit", async function(event) {
        event.preventDefault(); 

        const name = document.getElementById("name").value.trim();
        const position = document.getElementById("position").value.trim();
        const aliases = document.getElementById("aliases").value.trim();
        const content = document.querySelector("textarea[name='content']").value.trim();
		if (name && position && aliases && content) {
			const positionPattern = /^-?\d+\.\d+\s?,\s?-?\d+\.\d+$/;
            if (!positionPattern.test(position)) {
                alert("The position must be in the form 'xxx.xxx, xxx.xxx'");
                return;
            }
			const positionArray = position.split(/\s*,\s*/).map(Number);
			const aliasesArray = aliases.split(/\s*,\s*/).filter(alias => alias.trim() !== "");
			try{
				const newMarker = {'position': positionArray, name, 'aliases': aliasesArray, content}
				let markersList = await readMarkers();
				
				markersList.push(newMarker);
				//the question is now how to update the JSON file without a backend server listening for a fetch request
			} catch(error){
				console.error('Error reading markers:', error);
			}
        } else {
            alert("Please fill in all the fields before submitting the form.");
        }
    });
}

async function readMarkers() {
	const url = "../map/markers.json";
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error(error.message);
	}
}
