

export default class Imgfunc {

  //폼데이터에 데이터 넣는 함수
  formDataAppend(formdata, data) {
    formdata.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    )
    return formdata;
  };

  //폼데이터에 파일 이름 넣는 함수
  formdataAddFileName(imagefiles, formdata) {
    Object.values(imagefiles).forEach(
      file => Object.values(file.files).forEach(
        f => formdata.append(file.name, f)));
    return formdata;
  };


}