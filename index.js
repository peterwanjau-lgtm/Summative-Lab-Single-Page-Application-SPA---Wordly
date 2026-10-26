
async function getWord() {

    const word = document.getElementById("word").value.trim();

    if (!word) {
        throw new Error("Please enter a word.");
    }

    document.getElementById("error").textContent = "";

    const ids = [
        "wordTitle", "pronunciation", "partOfSpeech",
        "definition", "examples", "synonyms", "antonyms",
        "tags", "wordForms", "source"
    ];

    ids.forEach(id => {
        document.getElementById(id).textContent = "";
    });

    const url =
        `https://freedictionaryapi.com/api/v1/entries/en/${encodeURIComponent(word)}`;

    const response = await fetch(url);

    if (response.status !== 200) {
        throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.entries || data.entries.length === 0) {
        throw new Error("No dictionary entry found.");
    }

    const entries = data.entries;

    const pronunciations = [];
    const partsOfSpeech = [];
    const definitions = [];
    const examples = [];
    const synonyms = [];
    const antonyms = [];
    const tags = [];
    const forms = [];

    entries.forEach(entry => {

        if (entry.partOfSpeech) {
            partsOfSpeech.push(entry.partOfSpeech);
        }

        (entry.pronunciations || []).forEach(p => {
            if (p.text) pronunciations.push(p.text);
            tags.push(...(p.tags || []));
        });

        synonyms.push(...(entry.synonyms || []));
        antonyms.push(...(entry.antonyms || []));

        (entry.forms || []).forEach(form => {
            forms.push(
                form.word +
                (form.tags?.length ? ` (${form.tags.join(", ")})` : "")
            );
        });

        (entry.senses || []).forEach(sense => {
            if (sense.definition) {
                definitions.push(sense.definition);
            }

            examples.push(...(sense.examples || []));
            synonyms.push(...(sense.synonyms || []));
            antonyms.push(...(sense.antonyms || []));
            tags.push(...(sense.tags || []));
        });
    });

    document.getElementById("wordTitle").textContent =
        data.word || word;

    document.getElementById("pronunciation").textContent =
        "Pronunciation: " +
        [...new Set(pronunciations)].join(", ");

    document.getElementById("partOfSpeech").textContent =
        "Part of speech: " +
        [...new Set(partsOfSpeech)].join(", ");

    document.getElementById("definition").textContent =
        "Definitions: " +
        [...new Set(definitions)].join(" | ");

    document.getElementById("examples").textContent =
        "Examples: " +
        [...new Set(examples)].join(" | ");

    document.getElementById("synonyms").textContent =
        "Synonyms: " +
        [...new Set(synonyms)].join(", ");

    document.getElementById("antonyms").textContent =
        "Antonyms: " +
        [...new Set(antonyms)].join(", ");

    document.getElementById("tags").textContent =
        "Tags: " + [...new Set(tags)].join(", ");

    document.getElementById("wordForms").textContent =
        "Word forms: " + [...new Set(forms)].join(", ");

    document.getElementById("source").textContent =
        "Source: " + (data.source?.url || "Not provided");

    console.log(data);
}

document.getElementById("getData").addEventListener("click", () => {
    getWord().catch(error => {
        document.getElementById("error").textContent = error.message;
        console.error(error);
    });
});
