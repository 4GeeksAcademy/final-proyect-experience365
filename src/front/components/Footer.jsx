import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCopyright } from "@fortawesome/free-solid-svg-icons";

export const Footer = () => (
	<footer
		className="footer mt-auto py-5 text-center"
		style={{
			// background: "linear-gradient(200deg,rgb(12, 55, 110) 0%, #2a7b9b 33%, #57c785 63%, rgba(237, 221, 83, 0.74) 100%",
			height: "20vh",
			// background: "#0c5775",
			// background: "linear-gradient(180deg,hsl(197, 33.30%, 4.10%) 0%, #2a7b9b 33%, #57c785 63%, rgba(237, 221, 83, 0.74) 100%"
		}}
	>
		<p className="footer-text">
			2025 © Experience365
		</p>
		<p className="footer-text">
			Made with <FontAwesomeIcon icon={faHeart} className="text-danger" /> by{" "}
			<a href="http://www.4geeksacademy.com" className="footer-text" style={{ color: "black" }}>4Geeks Academy</a>
		</p>
	</footer>
);
