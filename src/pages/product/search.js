import Header from "../../components/header";
const Search = (props) => {
  return (
    <div>
      <Header />
      {console.log(props.query)}
    </div>
  );
};

export async function getStaticProps({ query }) {
  return { props: query };
}

export default Search;
