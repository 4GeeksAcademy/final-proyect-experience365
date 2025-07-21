import React, { useEffect, useState } from "react";

export const Reviews = ({ activityId }) => {
    const [reviews, setReviews] = useState([]);
    const [average, setAverage] = useState(0);
    const [distribution, setDistribution] = useState({});
    const [canReview, setCanReview] = useState(false);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);

    useEffect(() => {

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rating/activity/${activityId}`)
            .then((res) => res.json())
            .then((data) => {
                setReviews(data.reviews);
                calculateStats(data.reviews);
            })
            .catch(err => console.error("Error al cargar valoraciones", err));

        // Verificar si el usuario puede dejar una reseña
        const token = localStorage.getItem("token");
        if (token) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rating/allowed/${activityId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setCanReview(data.allowed);
                    console.log("¿Puede dejar reseña?", data.allowed);
                })
                .catch((err) => console.error("Error al verificar permiso para reseñar", err));
        }
    }, [activityId]);

    const calculateStats = (data) => {
        if (!Array.isArray(data) || data.length === 0) {
            setAverage(0);
            setDistribution({});
            return;
        }

        const total = data.length;

        const sum = data.reduce((acc, r) => {
            const value = r.rating ?? r.stars ?? 0;
            return acc + value;
        }, 0);

        const avg = total > 0 ? (sum / total).toFixed(1) : "0.0";
        setAverage(avg);

        const counts = [0, 0, 0, 0, 0];
        data.forEach((r) => {
            const value = r.rating ?? r.stars ?? 0;
            if (value >= 1 && value <= 5) {
                counts[value - 1]++;
            }
        });

        const dist = {};
        counts.forEach((count, index) => {
            dist[5 - index] = ((counts[4 - index] / total) * 100).toFixed(0);
        });

        setDistribution(dist);
    };

    const handleSubmitReview = () => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rating`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                activity_id: activityId,
                stars: rating,
                comment,
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al enviar la reseña");
                return res.json();
            })
            .then((response) => {
                const newReview = response.rating;

                const formattedReview = {
                    ...newReview,
                    rating: newReview.stars,
                };

                const updatedReviews = [...reviews, formattedReview];

                setReviews(updatedReviews);
                calculateStats(updatedReviews);
                setComment("");
                setRating(5);
                setCanReview(false);
            })
            .catch((err) => console.error("Error al enviar reseña:", err));
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h3 className="card-title">Reseñas</h3>

                <div className="row mt-3">
                    <div className="col-md-4 text-center">
                        <h1 className="display-4">{average}</h1>
                        <div className="text-warning fs-3">
                            {"★".repeat(Math.round(average)) + "☆".repeat(5 - Math.round(average))}
                        </div>
                        <p className="text-muted">{reviews.length} valoraciones</p>
                    </div>

                    <div className="col-md-8">
                        {Object.entries(distribution).map(([stars, percent]) => (
                            <div key={stars} className="d-flex align-items-center mb-2">
                                <div className="me-2" style={{ width: "3rem" }}>{stars} ★</div>
                                <div className="progress flex-grow-1" style={{ height: "10px" }}>
                                    <div
                                        className="progress-bar bg-warning"
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>
                                <span className="ms-2 text-muted">{percent}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4">
                    {reviews.map((review, index) => (
                        <div key={index} className="border-top pt-3">
                            <div className="d-flex align-items-center mb-1">
                                <div className="bg-secondary text-white rounded-circle me-2 d-flex justify-content-center align-items-center" style={{ width: "40px", height: "40px" }}>
                                    {review.user_name?.[0]?.toUpperCase() || "U"}
                                </div>
                                <div>
                                    <strong>{review.user_name}</strong>
                                    <div className="text-warning small">
                                        {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                                    </div>
                                </div>
                            </div>
                            <p className="mb-1">“{review.comment}”</p>
                            <small className="text-muted">
                                {new Date(review.created_at).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                            </small>
                        </div>
                    ))}
                </div>
                {canReview && (
                    <div className="mt-4 border-top pt-3">
                        <h5>Deja tu reseña</h5>
                        <div className="mb-2">
                            <label className="form-label">Calificación</label>
                            <select
                                className="form-select"
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                            >
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <option key={star} value={star}>{star} ★</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Comentario</label>
                            <textarea
                                className="form-control"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmitReview}
                            disabled={!comment.trim()}
                        >
                            Enviar reseña
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};