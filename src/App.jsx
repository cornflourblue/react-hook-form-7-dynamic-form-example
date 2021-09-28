import { useEffect } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

function App() {
    // form validation rules 
    const validationSchema = Yup.object().shape({
        numberOfTickets: Yup.string()
            .required('Number of tickets is required'),
        tickets: Yup.array().of(
            Yup.object().shape({
                name: Yup.string()
                    .required('Name is required'),
                email: Yup.string()
                    .email('Email is Invalid')
                    .required('Email is required')
            })
        )
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // functions to build form returned by useForm() and useFieldArray() hooks
    const { register, control, handleSubmit, reset, formState, watch } = useForm(formOptions);
    const { errors } = formState;
    const { fields, append, remove } = useFieldArray({ name: 'tickets', control });

    // watch to enable re-render when ticket number is changed
    const numberOfTickets = watch('numberOfTickets');

    useEffect(() => {
        // update field array when ticket number changed
        const newVal = parseInt(numberOfTickets || 0);
        const oldVal = fields.length;
        if (newVal > oldVal) {
            // append tickets to field array
            for (let i = oldVal; i < newVal; i++) {
                append({ name: '', email: '' });
            }
        } else {
            // remove tickets from field array
            for (let i = oldVal; i > newVal; i--) {
                remove(i - 1);
            }
        }
    }, [numberOfTickets]);

    function onSubmit(data) {
        // display form data on success
        alert('SUCCESS!! :-)\n\n' + JSON.stringify(data, null, 4));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card m-3">
                <h5 className="card-header">React Hook Form 7 - Dynamic Form Example</h5>
                <div className="card-body border-bottom">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Number of Tickets</label>
                            <select name="numberOfTickets" {...register('numberOfTickets')} className={`form-control ${errors.numberOfTickets ? 'is-invalid' : ''}`}>
                                {['', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i =>
                                    <option key={i} value={i}>{i}</option>
                                )}
                            </select>
                            <div className="invalid-feedback">{errors.numberOfTickets?.message}</div>
                        </div>
                    </div>
                </div>
                {fields.map((item, i) => (
                    <div key={i} className="list-group list-group-flush">
                        <div className="list-group-item">
                            <h5 className="card-title">Ticket {i + 1}</h5>
                            <div className="form-row">
                                <div className="form-group col-6">
                                    <label>Name</label>
                                    <input name={`tickets[${i}]name`} {...register(`tickets.${i}.name`)} type="text" className={`form-control ${errors.tickets?.[i]?.name ? 'is-invalid' : ''}`} />
                                    <div className="invalid-feedback">{errors.tickets?.[i]?.name?.message}</div>
                                </div>
                                <div className="form-group col-6">
                                    <label>Email</label>
                                    <input name={`tickets[${i}]email`} {...register(`tickets.${i}.email`)} type="text" className={`form-control ${errors.tickets?.[i]?.email ? 'is-invalid' : ''}`} />
                                    <div className="invalid-feedback">{errors.tickets?.[i]?.email?.message}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="card-footer text-center border-top-0">
                    <button type="submit" className="btn btn-primary mr-1">
                        Buy Tickets
                    </button>
                    <button onClick={() => reset()} type="button" className="btn btn-secondary mr-1">Reset</button>
                </div>
            </div>
        </form>
    )
}

export { App };