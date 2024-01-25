import React, { Fragment } from 'react'
import { Form, InputGroup, } from 'react-bootstrap';
import Image from 'next/image';

import { useModal } from '@/hooks';
import style from "./style.module.scss";
import { iconDeleteError, iconUser } from '@/assets/images';
import { Button, CheckBox, CustomModal, Heading } from '@/shared/components';

const EditProfile = () => {
    const { edit_profile, edit_profile_buttons } = style;
    const { isShowing, toggle } = useModal()
    return (
        <Fragment>
            <section className={edit_profile}>
            <Heading title='Add Profile' backBtn={-1} deleteIcon={iconDeleteError} deleteTitle="Delete Profile" deleteModal={toggle}/>
            <Form>
                <Form.Group className="form-group">
                    <Form.Label>Profile Name</Form.Label>
                    <InputGroup className="form-group">
                        <InputGroup.Text id="basic-addon1"><Image src={iconUser} alt="iconUser" /></InputGroup.Text>
                        <Form.Control type='text' placeholder="XYZ Name" />
                    </InputGroup>
                </Form.Group>
                <Form.Group className="form-group">
                    <Form.Label>Select Gender</Form.Label>
                    <div className='d-flex flex-wrap gap-3'>
                        <div className={edit_profile_buttons}><CheckBox bgDark title="English" /></div>
                        <div className={edit_profile_buttons}><CheckBox bgDark title="Gujarati ગુજરાતી" /></div>
                    </div>
                </Form.Group>
                <Button bgOrange>Update Profile</Button>
                <Form.Group>
                </Form.Group>
            </Form>
        </section>
        {isShowing &&
            <CustomModal title='Delete Profile?' closeConfirm={toggle} showClose>
              <div className="modal-body">
                <p>The profile data, favorites and watch history will be permanently deleted. You won’t be able to access it again. Are you sure?</p>
              </div>
              <div className="flex-space gap-3">
                <Button bgDark fullWidth onClick={toggle}>Go Back</Button>
                <Button bgOrange fullWidth>Yes, Delete Profile</Button>
              </div>
            </CustomModal>
          }
        </Fragment>
    )
}

export default EditProfile