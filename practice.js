const attribute = {
  color: undefined,
  size: undefined,
};

const attributesFormatter = (attributes) => {
  const attributesArr = Object.keys(attributes).filter(
    (item) => attributes[item]?.value !== undefined
  );

  const formattedAttributes = attributesArr.map((item) => ({
    slug: item,
    value: attributes[item]?.value,
  }));
  return formattedAttributes;
};

// const attributs = Object.keys(attribute).map((item) => {
//   if (attribute[item]?.value) {
//     return {
//       slug: item,
//       value: attribute[item]?.value,
//     };
//   }
// });

console.log(attributesFormatter(attribute));

const specification = [
  {
    heading: "Main specification",
    items: [
      {
        title: "Model",
        value: "H110",
      },
      {
        title: "Brand",
        value: "Gigabyte",
      },
    ],
  },
  {
    heading: "Warranty information",
    items: [
      {
        title: "Warranty",
        value: "1 Year",
      },
    ],
  },
];

const str = "r,b,c";

console.log(str.split(","));

const params = {
  sortBy: "price",
  sortOrder: "asc",
  category: "all",
};

const path = "/general/riyazul.jpg";

console.log(path.split("/").pop());

const reviews = [
  {
    id: "a8bc7822-19a6-4711-a510-6d43032ea47c",
    rating: 5,
    comment: "This is a good product",
    created_at: "2025-01-17T18:40:45.235Z",
    updated_at: "2025-01-17T18:40:45.235Z",
    user: {
      name: "Riyazul Haque",
      email: "riyazulhaque64@gmail.com",
      profile_pic: "1733176606399_Riyazul-Haque.jpg",
    },
  },
  {
    id: "98adc133-8b2d-480b-88e7-0f7877a1262d",
    rating: 4,
    comment: "This is a best product",
    created_at: "2025-01-17T18:41:07.421Z",
    updated_at: "2025-01-17T18:41:07.421Z",
    user: {
      name: "Riyazul Haque",
      email: "riyazulhaque64@gmail.com",
      profile_pic: "1733176606399_Riyazul-Haque.jpg",
    },
  },
  {
    id: "872dcb50-c5c0-45ff-b255-29adaf874efe",
    rating: 4.5,
    comment: "This is the best product",
    created_at: "2025-01-17T18:51:53.758Z",
    updated_at: "2025-01-17T18:51:53.758Z",
    user: {
      name: "Riyazul Haque",
      email: "riyazulhaque64@gmail.com",
      profile_pic: "1733176606399_Riyazul-Haque.jpg",
    },
  },
  {
    id: "00181501-bc8e-49c4-8640-a18593c366bd",
    rating: 4.3,
    comment: "This is the best product",
    created_at: "2025-01-17T18:58:51.330Z",
    updated_at: "2025-01-17T18:58:51.330Z",
    user: {
      name: "Riyazul Haque",
      email: "riyazulhaque64@gmail.com",
      profile_pic: "1733176606399_Riyazul-Haque.jpg",
    },
  },
];

const group = reviews.reduce((group, review) => {
  const rating = Math.round(review.rating);
  if (!group[rating]) group[rating] = [];
  group[rating].push(review);
  return group;
}, {});

