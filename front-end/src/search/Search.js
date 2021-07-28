import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import Reservations from "../reservations/Reservations";
import { readByPhone } from "../utils/api";

// defines the Search page
export default function Search() {

    const initialFormState = {
        mobile_number: "",
    };

    const [form, setForm] = useState({...initialFormState});
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState([]);

    const history = useHistory();

    const handleChange = ({ target }) => {
        // set the form state
        setForm({
            ...form,
            [target.name]: target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        // GET request - by mobile_number
        async function findByPhone() {
            try {
                const response = await readByPhone(form.mobile_number, abortController.signal);
                if (response.length === 0) {
                    setSearchResults(["No reservations Found"]);
                } else {
                    setSearchResults(response);
                }
            } catch (error) {
                setSearchError([...searchError, error.message]);
            }
        }
        // do not send GET request if there is a pending error message
        if (searchError.length === 0) {
            findByPhone();
        }
    };

    return (
        <>
            <h3>Search by Phone Number</h3>
            <ErrorAlert error={searchError} />
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="mobile_number">Mobile Number</label>
                    <input 
                        type="text"
                        name="mobile_number"
                        id="mobile_number"
                        placeholder="Enter a customer's phone number"
                        onChange={handleChange}
                        required="required"
                        value={form.mobile_number}
                    />
                </div>
                <button type="submit">Find</button>
                <button type="button" onClick={() => history.goBack()}>Cancel</button>
            </form>
            {searchResults[0] === "No reservations Found" ? <h4>{searchResults[0]}</h4> : (
                <Reservations reservations={searchResults} />
            )}
        </>
    );
}