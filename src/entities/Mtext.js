// import {
//   TextGeometry,
//   MeshBasicMaterial,
//   Mesh,
//   Box3
// } from 'three';

// const Mtext = (entity) => {
//   const color = entity.getColor();

//   if (!entity.font) {
//     return console.log('font parameter not set. Ignoring text entity.')
//   }

//   const geometry = new TextGeometry(entity.props.text, {
//     font: entity.font,
//     size: entity.props.height * (4 / 5),
//     height: 1
//   });
//   const material = new MeshBasicMaterial({
//     color: color
//   });
//   const text = new Mesh(geometry, material);

//   // Measure what we rendered.
//   const measure = new Box3();
//   measure.setFromObject(text);

//   const textWidth = measure.max.x - measure.min.x;

//   // If the text ends up being wider than the box, it's supposed
//   // to be multiline. Doing that in threeJS is overkill.
//   if (textWidth > entity.props.width) {
//     console.log("Can't render this multipline MTEXT entity, sorry.", entity);
//     return undefined;
//   }

//   text.position.z = 0;
//   switch (entity.props.attachmentPoint) {
//     case 1:
//       // Top Left
//       text.position.x = entity.props.position.x;
//       text.position.y = entity.props.position.y - entity.props.height;
//       break;
//     case 2:
//       // Top Center
//       text.position.x = entity.props.position.x - textWidth / 2;
//       text.position.y = entity.props.position.y - entity.props.height;
//       break;
//     case 3:
//       // Top Right
//       text.position.x = entity.props.position.x - textWidth;
//       text.position.y = entity.props.position.y - entity.props.height;
//       break;

//     case 4:
//       // Middle Left
//       text.position.x = entity.props.position.x;
//       text.position.y = entity.props.position.y - entity.props.height / 2;
//       break;
//     case 5:
//       // Middle Center
//       text.position.x = entity.props.position.x - textWidth / 2;
//       text.position.y = entity.props.position.y - entity.props.height / 2;
//       break;
//     case 6:
//       // Middle Right
//       text.position.x = entity.props.position.x - textWidth;
//       text.position.y = entity.props.position.y - entity.props.height / 2;
//       break;

//     case 7:
//       // Bottom Left
//       text.position.x = entity.props.position.x;
//       text.position.y = entity.props.position.y;
//       break;
//     case 8:
//       // Bottom Center
//       text.position.x = entity.props.position.x - textWidth / 2;
//       text.position.y = entity.props.position.y;
//       break;
//     case 9:
//       // Bottom Right
//       text.position.x = entity.props.position.x - textWidth;
//       text.position.y = entity.props.position.y;
//       break;

//     default:
//       return undefined;
//   };

//   return text;
// }

// export default Mtext;