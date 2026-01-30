export const appicons =[];
function importAll(r) {
    console.log(r)
    let images = {};
    r.keys().map((item, index) => {
      images[item.replace('./', '')] = r(item);
      appicons.push(item.replace('./', ''))
    });
    return images;
}

export const images = importAll(require.context('../assets/images/appIcon', false, /\.(png|jpe?g|svg)$/));

