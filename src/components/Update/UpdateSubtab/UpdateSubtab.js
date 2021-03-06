import "./UpdateSubtab.css"

import { Modal, Form, FormGroup, FormLabel, Button } from "react-bootstrap";
import React, { useState, useContext } from "react";
import { DeleteSubtab } from "components";
import AuthContext from "context/auth";
import GlobalContext from "context/global";
import apiClient from "services/apiClient";

export default function UpdateSubtab(props) {

    const { setErrors, setIsLoading } = useContext(AuthContext);
    const { setSubtabs } = useContext(GlobalContext);

    const subtab = props.subtab;

    const [form, setForm] = useState({
        name: subtab.name,
        priority: subtab.priority,
    });


    //update subtab in list of subtabs
    const updateSubtab = (updatedSubtab) => {
        setSubtabs(oldSubtabs => oldSubtabs.map(oldSubtab => oldSubtab.id === updatedSubtab.id ? updatedSubtab : oldSubtab));
        props.updateDirectory("update", updatedSubtab);
    }


    const handleOnInputChange = (event) => {
        setForm((f) => ({ ...f, [event.target.name]: event.target.value }));
    }


    const handleOnSubmit = async (event) => {

        event.preventDefault();
        setIsLoading(true);
        setErrors((e) => ({ ...e, form: null }));

        let result;

        if (form.name !== "") { //if name is empty, it will not change the name
            result = await apiClient.updateSubtab(subtab.id, { 
                subtab: {
                    name: form.name,
                    priority: form.priority,
                }
            });
        }

        if (result) {
            const { data, error } = result;

            const dbSubtab = data.subtab;

            if (error) {
                setErrors((e) => ({ ...e, form: error }));
            } else {
                setErrors((e) => ({ ...e, form: null }));
                setForm({ name: dbSubtab.name,
                          priority: dbSubtab.priority, });
                updateSubtab(dbSubtab);
            } 

        } else { //if name is empty, it will set the name in form to current maintab name
            setForm ({  name: subtab.name,
                        priority: subtab.priority, });
        }


        setIsLoading(false);
    }


    //method to show modal for deleting confirmation...
    const [deleteModalShow, setDeleteModalShow] = useState(false);

    return (
      <Modal
            {...props}
            size="lg"
            className="UpdateSubtab"
            aria-labelledby="contained-modal-title-vcenter"
            centered
      >
        <Form onSubmit={handleOnSubmit} className="modal-area">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Subtab
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <FormGroup>
                    <FormLabel className="form-label">Name of subtab</FormLabel>
                    <Form.Control
                        type="text"
                        name="name"
                        className="input-field"
                        maxLength={30}
                        onChange={handleOnInputChange}
                        value={form.name}
                    />

                    <FormLabel className="form-label"><div>Priority</div> &nbsp; <p>(optional)</p></FormLabel>
                    <Form.Control
                        as="select"
                        name="priority"
                        className="input-field"
                        aria-label="Select priority"
                        onChange={handleOnInputChange}
                        value={form.priority}
                        custom
                    >
                        <option selected></option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </Form.Control> 
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <div id="option" onClick={() => setDeleteModalShow(true)}>                    
                    <i className="bi-trash"/> Delete
                </div>
                <div className="modal-button">
                    <Button type="submit" onClick={props.onHide} className="button" disabled={!form.name?.trim()}>
                        Save
                    </Button>
                </div>
            </Modal.Footer>
        </Form>

        <DeleteSubtab
            show={deleteModalShow}
            onHide={() => setDeleteModalShow(false)}
            subtab={subtab}
            updateDirectory={props.updateDirectory}
        />

      </Modal>
    );
}