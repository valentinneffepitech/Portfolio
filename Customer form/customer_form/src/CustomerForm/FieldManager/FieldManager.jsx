const FieldManager = ({ field, inputValues }) => {

    const {
        name,
        type,
        value,
        isRequired,
        accepts,
        placeholder,
        label } = field;

    const telPattern = "[0-9]{10}";

    return (
        <label>
            {
                (label && type !== 'file') ?
                    label
                    :
                    <div>
                        <div className='btn btn-info'>
                            Parcourir
                        </div>
                        {value}
                    </div>
            }
            <input
                className="form-control"
                name={name}
                type={type ?? "text"}
                pattern={type === 'tel' && telPattern}
                required={isRequired}
                placeholder={placeholder ?? "random field"}
                defaultValue={value ?? ""}
                accept={accepts ?? ""}
                onChange={(e) => {
                    if (e.target.type != 'file') {
                        inputValues(prev => ({
                            ...prev, [e.target.name]: e.target.value
                        }))
                    } else {
                        inputValues(prev => ({
                            ...prev, [e.target.name]: e.target.files[0]
                        }))
                    }
                }}
            />
            {
                isRequired ?
                    <i>* Ce champ est obligatoire</i>
                    : null
            }
        </label>
    )
}

export default FieldManager
