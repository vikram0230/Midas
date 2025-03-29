

# Endpoint 1 (POST) - Predict future data (Params: start_time_future, end_time_future)
    # Flow
    # 1. Call Prediction Model with parameters
    # 2. Return data

# Endpoint 2 (POST) - Realtime Insert data into convex db (Params: data)
    # Flow
    # 1. Get data from Plaid Real Time
    # 3. Insert data into convex db

# Endpoint 3 (POST) - What if analysis (Params: data)
    # Flow
    # 1. Get data from request on decrease, increase, and no change
    # 2. Call prediction model to predict future data with parameters
    # 3. Return data

# Endpoint 4 (POST) Anomaly
    # Flow
    # 1. Call convex db to find anomalies in data
    # 2. Return data