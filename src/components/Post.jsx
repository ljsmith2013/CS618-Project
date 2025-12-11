import PropTypes from "prop-types";
import { User } from "./User.jsx";

export function Post({ title, contents, ingredients, imageUrl, author: userId }) {
  return (
    <article>
      <h3>{title}</h3>
      {imageUrl && (
        <div>
          <img
            src = {imageUrl}
            alt = {title}
            style = {{ width: "100%", maxWidth: "400px", height: "250px", objectFit: "cover", display: "block"}}
          />
        </div>
      )}
      {Array.isArray(ingredients) && ingredients.length > 0 && (
        <section>
          <h4>Ingredients</h4>
          <ul>
            {ingredients.map((item, index) => (
              <li key = {index}>{item}</li>
            ))}
          </ul>
        </section>
      )}
      {contents && (
        <section>
          <h4>Instructions</h4>
          <p>{contents}</p>
        </section>
      )}
      {userId && (
        <em>
          <br />
          Written by <User id={userId} />
        </em>
      )}
    </article>
  );
}
Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  ingredients: PropTypes.arrayOf(PropTypes.string),
  imageUrl: PropTypes.string,
  author: PropTypes.string,
};
