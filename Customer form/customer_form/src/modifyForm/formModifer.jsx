import React, { useEffect, useState } from 'react'

const FormModifer = () => {
    const [inputs, setinputs] = useState(null);
    useEffect(() => {
        fetch('http://127.0.0.1:3001?action=generateForm', {
            method: 'GET'
        }).then(res => res.json()).then(data => setinputs(data));
    }, [])
    const ManageInputs = (id, value) => {
        let datas = new FormData();
        datas.append('action', 'updateInput');
        datas.append('id', id);
        datas.append('value', value);
        try {
            fetch('http://127.0.0.1:3001', {
                method: 'POST',
                body: datas
            }).then(res => res.json()).then(data => {
                setinputs(data);
                console.log(data);
            });
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <form id="adminInputs">
            <h3>Sélectionnez quels éléments seront requis lors de l&apos;inscription</h3>
            {
                inputs && inputs.map(input => (
                    <label key={input.id} className={input.isRequired && "checked"}>
                        {input.placeholder}
                        <input type='checkbox' defaultChecked={input.isRequired} onChange={(e) => ManageInputs(input.id, e.target.checked)} />
                    </label>
                ))
            }
        </form>
    )
}

export default FormModifer
