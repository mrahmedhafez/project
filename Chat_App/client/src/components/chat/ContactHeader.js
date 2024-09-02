import React from "react";
import Avatar from "components/Avatar";
import { Row } from "reactstrap";

const ContactHeader = props => {
  const userAvatar = props.user?.avatar;

    return (
        <Row className="heading">
            <Avatar src={userAvatar} />
            <div>جهات الاتصال</div>
            <div className="mr-auto nav-link" onClick={props.toggle}>
                <i className="fa fa-bars" />
            </div>
        </Row>
    );
};

export default ContactHeader;