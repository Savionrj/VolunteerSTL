export default function filterEfforts(efforts = [], search = '') {
  return efforts.filter((effort) => {
    const lowerSearch = search.toLowerCase();
    return (
      effort.effortName.toLowerCase().includes(search.toLowerCase()) ||
      effort.address.toLowerCase().includes(search.toLowerCase())
      ||
      effort.city.toLowerCase().includes(search.toLowerCase())
      ||
      effort.state.toLowerCase().includes(search.toLowerCase())
      ||
      effort.zipCode.toLowerCase().includes(search.toLowerCase())
      ||
      effort.description.toLowerCase().includes(search.toLowerCase()) ||
      effort.organizerName.toLowerCase().includes(search.toLowerCase()) ||
      effort.tags.some(tag => tag.name.toLowerCase().includes(search.toLowerCase()))
    );
  });
}
