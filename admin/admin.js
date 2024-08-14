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
			<input type="hidden" id="markerIndex" name="markerIndex" value="">
			<button type="submit">Submit</button>
		</div>
	</form>
`;


async function setForm() {
	document.getElementById("inputBox").innerHTML = formText;

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
			try {
				let markersList = await readMarkers();
				const markerIndex = document.getElementById("markerIndex").value;

				const newMarker = { 'position': positionArray, name, 'aliases': aliasesArray, content };

				if (markerIndex !== "") {
					markersList[markerIndex] = newMarker;
				} else {
					markersList.push(newMarker);
				}

				const response = await fetch('/updateMarkers', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(markersList),
				});

				if (response.ok) {
					console.log("Markers successfully updated.");  
					document.getElementById("markerForm").reset();
					listMarkers(); 
				} else {
					console.error("Error updating markers:", response.statusText);
				}

			} catch (error) {
				console.error('Error updating markers:', error);
			}
		} else {
			alert("Please fill in all the fields before submitting the form.");
		}
	});
}

function loadMarkertoFields(index) {
	console.log("Editing marker at index:", index); 
	const marker = markers[index];

	if (marker) {
		document.getElementById("name").value = marker.name;
		document.getElementById("position").value = marker.position.join(", ");
		document.getElementById("aliases").value = marker.aliases.join(", ");
		document.getElementById("content").value = marker.content;
		document.getElementById("markerIndex").value = index;
	} else {
		console.error("Marker not found at index:", index);
	}
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

async function listMarkers() {
	var result = ``;
	markers = await readMarkers(); 
	console.log("Markers loaded:", markers);

	for (var i = 0; i < markers.length; i++) {
		result += `<p>${markers[i]["name"]} ${markers[i]["position"]} <button onclick='loadMarkertoFields(${i})'>edit</button></p>`;
	}
	document.getElementById("markersBox").innerHTML = result;
}

listMarkers();
