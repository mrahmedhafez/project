import React from "react";
import { Row, Form, Input, Button } from "reactstrap";
import Error from "components/Error";
import Avatar from 'components/Avatar';
import axios from "axios";

class EditProfile extends React.Component {

  state = {name: '', about: ''};
  componentDidMount(){
    if(this.props.user){ // تحقق من كون القيمة معرفة
      this.setState({ //state ومن ثم وإسنادها الى  props إستخلاص البيانات من  
        name:this.props.user.name, abount:this.props.user.about, avatar:this.props.user} )
    }
  }
  constructor(props) {
    super(props);
    this.fileUpload = React.createRef();
  }

  showFileUpload = e  => this.fileUpload.current.click();

  onImageChange = e => {
    if (e.target.files && e.target.files[0]) {
      this.setState({
        image: URL.createObjectURL(e.target.files[0]),
        avatar: e.target.files[0]
      });
    }
  };

  onChange = e => this.setState({[e.target.name]: e.target.value, error: null});

  onSubmit = e => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', this.state.name);
    data.append('about', this.state.about);
    if (this.state.avatar) data.append('avatar', this.state.avatar, this.state.avatar.name);
    axios.post('/api/account', data)
    .then(this.props.toggle)
    .catch(err => this.setState({
      error: err.response.data.message
    }));
  };

  onClose = e => {
    this.setState({name: this.props.user.name, about: this.props.user.about});
    this.props.toggle();
  };

  render(){
    return (
      <div className={this.props.open ? 'side-profile open' : 'side-profile'}>
        <Row className="heading">
          <div className="mr-2 nav-link" onClick={this.onClose}>
            <i className="fa fa-arrow-right" />
          </div>
          <div>الملف الشخصي</div>
        </Row>
        <div className="d-flex flex-column" style={{overflow: 'auto'}}>
          <Form onSubmit={this.onSubmit}>
            <Error error={this.state.error} />
            <div className="text-center" onClick={this.showFileUpload}>
            <Avatar src={this.props.user?.avatar} file={this.state.image} />
            </div>
            <input type="file" ref={this.fileUpload} onChange={this.onImageChange} className="d-none"/>
            <div className="bg-white px-4 py-2">
              <label className="text-muted">الاسم</label>
              <Input value={this.state.name} name="name" onChange={this.onChange} required  autoComplete="off"/>
            </div>
            <div className="bg-white px-3 py-2">
              <label className="text-muted">رسالة الحالة</label>
              <Input value={this.state.about} name="about" onChange={this.onChange} required autoComplete="off" />
            </div>
            <div className="bg-white px-3 py-2">
              <Button block className="mt-3">حفظ</Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default EditProfile;