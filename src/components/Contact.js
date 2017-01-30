import React from 'react';
import ContactInfo from './ContactInfo';
import ContactDetails from './ContactDetails';
import ContactCreate from './ContactCreate';
import update from 'react-addons-update';

export default class Contact extends React.Component {

    constructor(props) {// state 사용시 무조건 초기화 필요!
        super(props);
        this.state = {
            selectKey : -1,
            keyword: '',
            contactData: [{
                name: 'Abet',
                phone: '010-0000-0001'
            }, {
                name: 'Betty',
                phone: '010-0000-0002'
            }, {
                name: 'Charlie',
                phone: '010-0000-0003'
            }, {
                name: 'David',
                phone: '010-0000-0004'
            }]
        };

        this.handleChange = this.handleChange.bind(this);//임의의 이벤트를 생성시 this를 꼭 bind 시켜야됨
        this.handleClick = this.handleClick.bind(this);

        this.handleCreate = this.handleCreate.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleRemove = this.handleRemove.bind(this);

    }

    //컴포넌트 생성 전에
    componentWillMount(){
      //localstorage는 string 형태로만 갖고 있을 수 있음.
      const contactData = localStorage.contactData;

      if (contactData) {
        this.setState({
          //String 형태를 오브젝트 형태로 변환
          contactData: JSON.parse(contactData)
        });
      }
    }

    componentDidUpdate(prevProps, prevState){
      //이전값과 현재의 값이 다를 경우
      if (JSON.stringify(prevState.contactData) != JSON.stringify(this.state.contactData)){
          localStorage.contactData = JSON.stringify(this.state.contactData);
      }
    }

    handleChange(e){//handleChange이벤트의 매개변수 e는 이벤트를 뜻함
      this.setState({//state 값변경시 react의 프로세스를 적용하기 위해서 setState로 변경해야 됨
        keyword: e.target.value
      });
    }

    handleClick(key){
      this.setState({
        selectKey: key
      });

       console.log(key, 'is selected');//컴포넌트 수정시 constructor함수를 타지 않음으로 수동 새로 고침 필요 F5
    }

    handleCreate(contact){
      this.setState({
        //1개의 아이템을 추가하더라고 [] 처리
        contactData: update(this.state.contactData, { $push: [contact] })
      });
    }

    handleRemove(){
      if (this.state.selectKey < 0){
        return;
      }

      console.log(this.state.selectKey);

      this.setState({
        contactData : update(
          this.state.contactData,
          //삭제시 해당 인덱스부터 개수까지 삭제 -> []두번
           {$splice: [[this.state.selectKey, 1]]}
         ),
         selectKey : -1
      });
    }

    handleEdit(name, phone){
      this.setState({
          contactData : update(this.state.contactData,
            {
              //수정 아이템 인덱스
              [this.state.selectKey]: {
                  name: { $set: name },
                  phone: { $set: phone }
              }
            }
          )
      });
    }

    render() {
        const mapToComponents = (data) => {
          data.sort();//자동으로 내림차순으로 정렬됨 별도의 정렬함수를 태우고 싶은 경우 매개함수를 통해 처리 가능
                      //ex) data.sort((a, b) => return a -b) => 숫자 내림차순,  data.sort(CompareNumber);
          data = data.filter(
            (contact) => {
              return contact.name.toLowerCase()
              .indexOf(this.state.keyword.toLowerCase()) > -1;//대소문자 구분 제거
            }
          );
            return data.map((contact, i) => {
                return (<ContactInfo
                          contact={contact}
                          key={i}
                          onClick={()=>{this.handleClick(i);}}/>);
                          //컴포넌트에서는 onclick 이벤트가 적용되지 않는다. (네이티브 dom (div, h1, button)는 적용됨)
                          //이런 경우 이벤트가 적용이 안되니깐, Props로 전달하면 된다.
                          //이벤트 처리시 에로우 function으로 전달하면 된다.
                          //ex) onClick = this.handleClick(i) X -> onClick = () => this.handleClick(i)
            });
        };

        return (
            <div>
                <h1>Contacts</h1>
                <input
                  name="keyword"
                  placeholder="Search"
                  value={this.state.keyword}
                  onChange={this.handleChange}
                />
                <div>{mapToComponents(this.state.contactData)}</div>
                <ContactDetails
                  isSelected = {this.state.selectKey != -1}
                  contact = {this.state.contactData[this.state.selectKey]}
                  onRemove = {this.handleRemove}
                  onEdit = {this.handleEdit}
                  />
                <ContactCreate
                  onCreate = {this.handleCreate}
                />
          </div>
        );
    }
}
