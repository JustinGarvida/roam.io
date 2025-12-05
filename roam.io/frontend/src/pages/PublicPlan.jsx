import React, { useState, useEffect } from "react";
import { supabase } from "../services/auth";
import { useParams } from "react-router-dom";

export default function PublicPlan() {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlan() {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("id", id)
        .eq("is_public", true)
        .single();

      setPlan(data);
      setLoading(false);
    }

    loadPlan();
  }, [id]);

if (loading) return <p>loading...</p>;
if (!plan) return <p>This plan is private or does not exist.</p>;

return (
  <div className="container py-4">
    <h1>{plan.name}</h1>

    <p><strong>From:</strong> {plan.from}</p>
    <p><strong>To:</strong> {plan.to}</p>
    <p><strong>Budget:</strong> {plan.budget}</p>

    <hr />

<p>
  <strong>Outbound:</strong> 
  {plan.outbound?.airline}, {plan.outbound?.time}, {plan.outbound?.airport}, {plan.outbound?.cost}
</p>

<p>
  <strong>Inbound:</strong> 
  {plan.inbound?.airline}, {plan.inbound?.time}, {plan.inbound?.airport}, {plan.inbound?.cost}
</p>

<p>
  <strong>Hotel:</strong> 
  {plan.hotel?.name}, {plan.hotel?.nights} nights, Total: {plan.hotel?.totalCost}
</p>
  </div>
);
} 