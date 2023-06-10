import styled from "styled-components";

export const FlexBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    height: 100vh;

    @media all and (min-width:320px){
        .title{
            position: absolute;
            z-index: 2;
            top: 0;
            left: 50%;
            transform: translatex(-50%);
            background-color: #fff;
            padding: 0px 20px;
            text-transform: uppercase;
            padding-bottom: 10px;
            font-size: 25px;
        }
    
    
        .round{
            position: absolute;
            z-index: 2;
            top: 60px;
            left: 50%;
            transform: translatex(-50%);
            background-color: #fff;
            padding: 0px 10px;
            text-transform: uppercase;
            padding-bottom: 0px;
            font-size: 30px;
        }
    
    
        .flex-1 {
            flex: 1;
            min-width: 300px;
            overflow: hidden;
            background-color: black;
            position:relative;
        }
        .food-img {
            width: 100%;
            height: 100%;
            transition: 0.5s;
            cursor: pointer;
            object-fit: cover;
        }
        .food-img:hover {
            transform: scale(1.0);
            opacity: 0.8;
        }

     
        .name{
            position: absolute;
            z-index: 3;
            color: #fff;
            bottom: 10%;
            font-size: 50px;
            left: 50%;
            transform: translateX(-50%);
        }
    }


    @media all and (min-width:1024px){
     

    .title{
        position: absolute;
        z-index: 2;
        top: 0;
        left: 50%;
        transform: translatex(-50%);
        background-color: #fff;
        padding: 0px 20px;
        text-transform: uppercase;
        padding-bottom: 10px;
        font-size: 50px;
    }


    .round{
        position: absolute;
        z-index: 2;
        top: 100px;
        left: 50%;
        transform: translatex(-50%);
        background-color: #fff;
        padding: 0px 10px;
        text-transform: uppercase;
        padding-bottom: 10px;
        font-size: 50px;
        
    }


    .flex-1 {
        flex: 1;
        min-width: 500px;
        overflow: hidden;
        background-color: black;
        position:relative;
    }
    .food-img {
        width: 100%;
        height: 100%;
        transition: 0.5s;
        cursor: pointer;
        object-fit: cover;
    }
    .food-img:hover {
        transform: scale(1.1);
        opacity: 0.8;
    }
    .name{
        position: absolute;
        z-index: 3;
        color: #fff;
        bottom: 10%;
        font-size: 90px;
        left: 50%;
        transform: translateX(-50%);
    }

}
`;