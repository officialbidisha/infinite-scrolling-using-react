import "./App.css";
import { useEffect, useState, useRef, useCallback } from "react";
import UserCard from "./components/UserCard";
const TOTAL_PAGES = 3;

function App() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [users, setUsers] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  console.log(users.length);
  
  const observer = useRef(null);
  const lastElementRef = useCallback((node)=> {
    if(loading) return;
    if(observer.current){
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        setPageNum((number) => number + 1);
      }
    });
    if(node){
      observer.current.observe(node);
    }
  
  }, [loading, pageNum])

  const callUser = async () => {
    debugger;
    setLoading(true);
    let result = await fetch(
      `https://randomuser.me/api/?page=${pageNum}&results=25&seed=abc`
    );
    let res = await result.json();

    setUsers((prevResult) => [...prevResult, ...res.results]);
    
    setLoading(false);
  };
  useEffect(() => {
    if (pageNum <= TOTAL_PAGES) {
      callUser();
    }
  }, [pageNum]);


  return (
    <div className="App row">
      {users.map((user,index)=> {
        if(users.length === index+1 && !loading && pageNum<=TOTAL_PAGES){
          return  <div ref={lastElementRef}  className="r">  <UserCard data={user} key={index} ></UserCard></div>
        }
        else{
          return <UserCard data={user} key={index}></UserCard>
        }
      })}
    </div>
  );
}

export default App;
