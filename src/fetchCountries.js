function getData(country) {
  return fetch(`https://restcountries.com/v3/name/${country}`).then(
    response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    }
  );
}
export { getData };
