var formText = `
		<form>
			<label for="name">marker name</label><br>
			<input type="text" id="name" name="name"><br>
			<br>
			<label for="position">marker position</label><br>
			<input type="text" id="position" name="position"><br>
			<br>
			<label for="aliases">aliases (for searching)</label><br>
			<input type="text" id="aliases" name="aliases"><br>
			<br>
			<label for="content">content</label><br>
			<textarea rows="10" cols="50" name="content"></textarea>
			<hr>
		</form>
`
// import markers.json
// iterate through
    // set text elements, default values in formtext
    // add to resultText
// add final stuff to resultText (submit button)
// apply


function setForm() {
    document.getElementById("adminBox").innerHTML = formText
}
setForm()