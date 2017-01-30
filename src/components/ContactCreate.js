import React from 'react';

export default class  ContactCreate extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      name: '',
      phone: ''
    };

    //메소스 바인딩
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    //엔터 눌러도 자동으로 추가되게 하는 기능
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange(e){
    //객체 선언
    let nextState ={};
    //target 이름에 해당하는 곳에 value 값 전달
    nextState[e.target.name] = e.target.value;
    //변경한 state 값 전달
    this.setState(nextState);
  }

  //click 이벤트 생성
  handleClick(){
    //변경할 일 없는 데이터임으로 const로 정의
    const contact = {
      name: this.state.name,
      phone: this.state.phone
    };
    //메소드 실행
    this.props.onCreate(contact);

    //input 초기화
    this.setState({
      name: '',
      phone: ''
    });

    this.nameInput.focus();
  }

  handleKeyPress(e){
    if (e.charCode == 13){
      this.handleClick();
    }
  }

  render() {
    return (
      <div>
        <h2>Create Contact</h2>

        <p>
          <input
            type='text'
            name='name'
            placeholder='name'
            value={this.state.name}
            onChange={this.handleChange}
            ref={(ref) => {this.nameInput = ref}}
          />
          <input
            type='text'
            name='phone'
            placeholder='phone'
            value={this.state.phone}
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
          />
        </p>
        <button onClick={this.handleClick}>Craete</button>
      </div>
    );
  }
}

//handelCreate를 props로 전달 받았기에 proptype과 기본값를 해준다.
ContactCreate.propTypes = {
  onCreate: React.PropTypes.func
};

ContactCreate.defaultProps = {
  onCreate : () => {console.error('onCreate not defined');}
};
