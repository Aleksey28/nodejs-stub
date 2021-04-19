async function rerun (id: number): Promise<void> {
    const options = {
        method:  'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
    };

    try {
        await fetch('http://localhost:1337/rerun', options);
    }
    catch (error) {
        console.log(error);
    }
}
