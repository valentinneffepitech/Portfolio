import { useEffect, useState } from 'react'
import FieldManager from './FieldManager/FieldManager';

const CustomerForm = ({ action }) => {
    const [fields, setFields] = useState(null);
    const [form, setForm] = useState({ action: action });

    useEffect(() => {
        fetch('http://127.0.0.1:3001?action=generateForm', {
            method: 'GET'
        }).then(res => res.json()).then(data => setFields(data));
    }, [])

    useEffect(() => {
        console.log(form);
    }, form);


    const handleDrop = (e) => {
        e.preventDefault()
        let droppedFile = e.nativeEvent.dataTransfer.files[0];
        if (droppedFile) {
            validateImageSize(droppedFile).then(() => {
                setForm(prev => ({
                    ...prev, photo: droppedFile
                }))
                alert('Image prise en compte');
                console.log(form)
            }).catch(err => {
                alert(err)
            });
        } else {
            alert('Type de fichier non accepté');
        }
    }

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const validateImageSize = (file) => {

        return new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.onload = () => {

                const img = new Image();
                img.onload = () => {

                    if (img.width > 200 || img.height > 200) {
                        reject('Dimensions maximales 200x200px');
                        return;
                    }

                    resolve();

                }
                img.src = reader.result;

            }

            reader.readAsDataURL(file);

        });

    }

    const sendData = async (e) => {
        e.preventDefault();
        const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
        if (!emailRegex.test(form.email)) {
          alert('Your Email seems incorrect');
          return;
        }
        let formInfos = new FormData();
        Object.keys(form).forEach((fieldName) => {
            formInfos.append(fieldName, form[fieldName]);
        })
        if (form.photo) {
            try {

                await validateImageSize(form.photo);

            } catch (err) {

                alert(err);
                return;

            }
        }
        fetch('http://localhost:3001', {
            method: 'POST',
            mode: 'cors',
            body: formInfos
        }).then(res => res.json()).then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                alert('Thx for your submission !');
            }
        })
    }

    return (
        <form
            onSubmit={(e) => sendData(e)}
            onDragOver={(e) => handleDrag(e)}
            onDrop={(e) => handleDrop(e)}
            draggable
        >
            {fields && fields.map((field, index) => (
                <FieldManager key={index} field={field} inputValues={setForm} />
            ))}
            <button
                className='btn btn-secondary'>
                Soumettre
            </button>
        </form>
    )
}

export default CustomerForm
