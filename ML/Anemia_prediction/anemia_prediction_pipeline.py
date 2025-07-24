# anemia_prediction_pipeline.py

# =============================
#  1. Importing Dependencies
# =============================
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

#  2. Load Dataset
df = pd.read_csv("anemia_dataset.csv")  # add your file

#  3. Data Cleaning & Preprocessing
df.drop(columns=["Number", "Name"], inplace=True)
df.columns = df.columns.str.strip()

# Encode Anaemic: Yes = 1, No = 0
le = LabelEncoder()
df['Anaemic'] = le.fit_transform(df['Anaemic'])

# 📊 4. Exploratory Data Analysis

# Hb distribution
plt.figure(figsize=(6, 4))
sns.histplot(df['Hb'], kde=True, bins=20, color='skyblue')
plt.title('Hemoglobin Distribution')
plt.xlabel('Hb')
plt.ylabel('Frequency')
plt.show()

# Class balance
sns.countplot(data=df, x='Anaemic')
plt.title("Class Distribution")
plt.xticks([0, 1], ['No', 'Yes'])
plt.show()

# Correlation heatmap (only numeric columns)
plt.figure(figsize=(8, 6))
df_numeric = df.select_dtypes(include=['number'])
sns.heatmap(df_numeric.corr(), annot=True, cmap='coolwarm')
plt.title("Correlation Heatmap (Numeric Features)")
plt.show()

# 🧪 5. Train-Test Split
X = df.drop(columns=['Anaemic'])
y = df['Anaemic']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 🤖 6. Model Training & Evaluation
models = {
    "Logistic Regression": LogisticRegression(max_iter=1000),
    "Decision Tree": DecisionTreeClassifier(random_state=42),
    "Gradient Boosting": GradientBoostingClassifier(random_state=42)
}

for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\nModel: {name}")
    print(f"Accuracy: {acc:.2f}")
    print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))
    print("Classification Report:\n", classification_report(y_test, y_pred))

#  7. Feature Importance (for tree-based models)
tree_model = models["Gradient Boosting"]
plt.figure(figsize=(6, 4))
feat_imp = pd.Series(tree_model.feature_importances_, index=X.columns)
feat_imp.sort_values().plot(kind='barh', color='purple')
plt.title("Feature Importance - Gradient Boosting")
plt.show()

# Conclusion
# Decision Tree and Gradient Boosting achieved solid accuracy on this small dataset.
# Hb shows strong predictive power. Future work: try cross-validation, SHAP, or XGBoost.
