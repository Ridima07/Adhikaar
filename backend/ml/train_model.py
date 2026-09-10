import os
import joblib
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score,
    accuracy_score
)


# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

DATASET_PATH = os.path.join(
    BASE_DIR,
    "data",
    "training_data.csv"
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "ml",
    "saved_models"
)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "scheme_relevance_model.pkl"
)


# --------------------------------------------------
# LOAD DATA
# --------------------------------------------------

if not os.path.exists(DATASET_PATH):
    raise FileNotFoundError(
        f"Dataset not found at: {DATASET_PATH}"
    )

df = pd.read_csv(DATASET_PATH)

print("Dataset loaded successfully.")
print("Dataset shape:", df.shape)


# --------------------------------------------------
# TARGET
# --------------------------------------------------

TARGET = "is_relevant"

if TARGET not in df.columns:
    raise ValueError(
        f"Target column '{TARGET}' not found in dataset."
    )

print("\nTarget distribution:")
print(df[TARGET].value_counts())


# --------------------------------------------------
# REMOVE UNUSED AND LEAKAGE COLUMNS
# --------------------------------------------------

DROP_COLUMNS = [
    # Identifiers
    "profile_id",
    "scheme_id",

    # Direct rule-engine outputs
    "status",
    "relevance_label",

    # Target
    "is_relevant",

    # Features calculated directly from eligibility results
    # These must not be used because they reveal the answer.
    "matched_conditions",
    "failed_conditions",
    "missing_conditions",
    "match_percentage",
    "has_failed_condition",
    "has_missing_information"
]

X = df.drop(
    columns=[
        column
        for column in DROP_COLUMNS
        if column in df.columns
    ]
)

y = df[TARGET]


# --------------------------------------------------
# IDENTIFY COLUMN TYPES
# --------------------------------------------------

categorical_columns = X.select_dtypes(
    include=["object", "string"]
).columns.tolist()

numeric_columns = X.select_dtypes(
    exclude=["object", "string"]
).columns.tolist()

print("\nCategorical columns:")
print(categorical_columns)

print("\nNumeric columns:")
print(numeric_columns)


# --------------------------------------------------
# PREPROCESSING
# --------------------------------------------------

numeric_pipeline = Pipeline(
    steps=[
        (
            "imputer",
            SimpleImputer(
                strategy="median"
            )
        )
    ]
)

categorical_pipeline = Pipeline(
    steps=[
        (
            "imputer",
            SimpleImputer(
                strategy="most_frequent"
            )
        ),
        (
            "encoder",
            OneHotEncoder(
                handle_unknown="ignore"
            )
        )
    ]
)

preprocessor = ColumnTransformer(
    transformers=[
        (
            "numeric",
            numeric_pipeline,
            numeric_columns
        ),
        (
            "categorical",
            categorical_pipeline,
            categorical_columns
        )
    ]
)


# --------------------------------------------------
# MODEL
# --------------------------------------------------

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=12,
    min_samples_split=4,
    min_samples_leaf=2,

    # Helps the model pay more attention to relevant schemes.
    class_weight="balanced_subsample",

    random_state=42,
    n_jobs=-1
)


# --------------------------------------------------
# COMPLETE PIPELINE
# --------------------------------------------------

pipeline = Pipeline(
    steps=[
        (
            "preprocessor",
            preprocessor
        ),
        (
            "model",
            model
        )
    ]
)


# --------------------------------------------------
# TRAIN-TEST SPLIT
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining rows:", len(X_train))
print("Testing rows:", len(X_test))


# --------------------------------------------------
# TRAIN
# --------------------------------------------------

print("\nTraining Random Forest model...")

pipeline.fit(
    X_train,
    y_train
)

print("Model training completed.")


# --------------------------------------------------
# EVALUATION
# --------------------------------------------------

y_probability = pipeline.predict_proba(
    X_test
)[:, 1]

# Default classification threshold.
# Lowering this increases recall but may reduce precision.
THRESHOLD = 0.50

y_pred = (
    y_probability >= THRESHOLD
).astype(int)


print("\nClassification threshold:")
print(THRESHOLD)

print("\nAccuracy:")
print(
    accuracy_score(
        y_test,
        y_pred
    )
)

print("\nROC-AUC:")
print(
    roc_auc_score(
        y_test,
        y_probability
    )
)

print("\nConfusion Matrix:")
cm = confusion_matrix(
    y_test,
    y_pred
)

print(cm)

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred,
        target_names=[
            "Not Relevant",
            "Relevant"
        ],
        zero_division=0
    )
)

print("\nFalse positives:")
print(cm[0][1])

print("\nFalse negatives:")
print(cm[1][0])


# --------------------------------------------------
# SAVE MODEL
# --------------------------------------------------

os.makedirs(
    MODEL_DIR,
    exist_ok=True
)

model_data = {
    "pipeline": pipeline,
    "target": TARGET,
    "threshold": THRESHOLD,
    "categorical_columns": categorical_columns,
    "numeric_columns": numeric_columns,
    "drop_columns": DROP_COLUMNS
}

joblib.dump(
    model_data,
    MODEL_PATH
)

print("\nModel saved successfully at:")
print(MODEL_PATH)