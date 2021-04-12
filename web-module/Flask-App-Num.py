from flask import Flask, jsonify, request, render_template
import math
import mediapipe as mp
import cv2
import numpy as np
from PIL import Image
from io import BytesIO
import base64
import json


def image_to_data_url(filename):
    ext = filename.split('.')[-1]
    prefix = f'data:image/{ext};base64,'
    with open(filename, 'rb') as f:
        img = f.read()
    return prefix + base64.b64encode(img).decode('utf-8')


app = Flask(__name__)

# MediaPipe Utility Objects.
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose


def get_angle(x1, y1, x2, y2):
    return math.atan((y2 - y1) / (x2 - x1)) * 180 / math.pi


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/comparejs', methods=['GET', 'POST'])
def image_comparejs():
    if request.method == 'POST':

        # Display the images in subplot (and count them)
        skeletons = []
        annotated_images = []

        # List of the two images we want to compare.
        # On index 0 will be the golden image.
        # On index 1 we will have the attempted image.
        dark_canvas = None
        files = json.loads(request.form['javascript_data'])
        files = files['images']

        with mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5) as pose:
            for idx, file in enumerate(files):

                im = Image.open(BytesIO(base64.urlsafe_b64decode(file)))
                image = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)

                image_height, image_width, _ = image.shape
                # print(image.shape)

                # Convert the BGR image to RGB before processing.
                results = pose.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

                # If no person was present.
                if not results.pose_landmarks:
                    print(
                        "No Pose Found! Please stay in front of the camera and try again.")
                    final_result = {
                        "Match": 0,
                        "Success": False
                    }
                    resp = jsonify(final_result)
                    resp.status_code = 509
                    return resp

                # Draw pose landmarks on the image.
                annotated_image = image.copy()

                # Draw landmarks on iamge
                mp_drawing.draw_landmarks(
                    annotated_image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

                # Draw landmarks on black canvas for only the skeleton image.
                dark_canvas = np.zeros(image.shape, np.uint8)

                mp_drawing.draw_landmarks(
                    dark_canvas, results.pose_landmarks, mp_pose.POSE_CONNECTIONS
                )

                # Make png files of the skeleton and annotated image.
                # cv2.imwrite('skeleton_image' + str(idx) + '.png', dark_canvas)
                # cv2.imwrite('annotated_image' + str(idx) + '.png', annotated_image)

                annotated_images.append(annotated_image)
                skeletons.append(results)

        cv2.imwrite('Annotated_Image1.jpeg', annotated_images[0])
        cv2.imwrite('Annotated_Image2.jpeg', annotated_images[1])
        # Angles Images stores angles for all images in the list.
        angles_images = []
        visibilities = []
        edge_directions = []
        edges = [(14, 16), (12, 14), (11, 12), (13, 11), (15, 13), (24, 12), (23, 11), (23, 24), (26, 24), (25, 23),
                 (28, 26), (27, 25)]
        edge_labels = ['', '', '']
        N = len(edges)

        # For every image that we have
        # we need to calculate angles of the edges with the horizontal axis(x-axis).
        for result in skeletons:
            angles_image = np.zeros((N,))
            visibility = np.zeros((N,))
            edge_direction = np.zeros((N,))
            i = 0
            for edge in edges:
                start, dest = edge

                # Get angles the particular edge makes with the horizontal for the current image.
                angles_image[i] = get_angle(result.pose_landmarks.landmark[start].x * image_width,
                                            result.pose_landmarks.landmark[start].y *
                                            image_height,
                                            result.pose_landmarks.landmark[dest].x *
                                            image_width,
                                            result.pose_landmarks.landmark[dest].y * image_height)

                edge_direction[i] = -1 if (result.pose_landmarks.landmark[dest].x * image_width -
                                           result.pose_landmarks.landmark[start].x * image_width) < 0 else 1

                visibility[i] = result.pose_landmarks.landmark[start].visibility + result.pose_landmarks.landmark[
                    dest].visibility
                i += 1

            angles_images.append(angles_image)
            visibilities.append(visibility)
            edge_directions.append(edge_direction)

        angles_images = np.array(angles_images)
        visibilities = np.array(visibilities)
        edge_directions = np.array(edge_directions)

        # print(angles_images)
        # Compare the first two images in the angles_images array.
        # Since we have the angles the edges make for each image
        # We are taking the difference between each of these angles for the two images.
        difference = np.zeros((N,))
        visibility_diff = abs(visibilities[1] - visibilities[0])
        edge_reversed = np.zeros((N,), dtype='int8')
        # print(angles_images.shape)

        for i in range(N):
            difference[i] = abs(angles_images[1][i] - angles_images[0][i])

            if angles_images[1][i] < 0:
                difference[i] = min(
                    abs(180 - abs(angles_images[1][i]) - angles_images[0][i]), difference[i])
            elif angles_images[0][i] < 0:
                difference[i] = min(
                    abs(180 - abs(angles_images[0][i]) - angles_images[1][i]), difference[i])

        # If the difference is 0 degree the match percentage for that edge is 100%
        # If the differeence is 90 degree the match percentage for that edge is 0%
        match_percent = (90 - difference) / 90 * 100
        visibility_match_percent = (2 - visibility_diff) / 2
        weighted_mask = np.array([8, 4, 1, 4, 8, 1, 1, 1, 4, 4, 8, 8])

        for i in range(N):
            # Edge present in one image and not the other imgage.
            if visibility_match_percent[i] < 0.4:
                match_percent[i] = 0

            # Edge not present in both -> Don't account for this edge.
            if visibilities[1][i] < 1 and visibilities[0][i] < 1:
                weighted_mask[i] = 0
                match_percent[i] = 0

                # If the edge direction for the a particular edge is opposite
        # and the angle is less than 45 deg then set match_percent as 0
        for i in range(N):
            if edge_directions[0][i] != edge_directions[1][i] and (
                    abs(angles_images[1][i]) < 45 and abs(angles_images[0][i]) < 45):
                edge_reversed[i] = 1
                match_percent[i] = 0

        for i in range(N):
            if i not in {2, 5, 6, 7}:
                if 0 < match_percent[i] < 90 or edge_reversed[i]:
                    start, dest = edges[i]
                    x1 = round(
                        result.pose_landmarks.landmark[start].x * image_width)
                    y1 = round(
                        result.pose_landmarks.landmark[start].y * image_height)
                    x2 = round(
                        result.pose_landmarks.landmark[dest].x * image_width)
                    y2 = round(
                        result.pose_landmarks.landmark[dest].y * image_height)

                    # Mark points that have less than threshold match percentage
                    cv2.circle(dark_canvas, (x1, y1), 10, (255, 230, 166), 2)
                    cv2.circle(dark_canvas, (x2, y2), 10, (255, 230, 166), 2)
                    cv2.line(dark_canvas, (x1, y1),
                             (x2, y2), (255, 167, 161), 4)

        cv2.imwrite('Error-Image.jpeg', dark_canvas)
        final_percentage = sum(
            match_percent * weighted_mask / sum(weighted_mask))

        # second: base64 encode read data
        # result: bytes (again)
        # base64_string = [0 for i in range(2)]
        # for i in range(2):
        #     base64_bytes = base64.b64encode(annotated_images[i].tobytes())
        #     base64_string[i] = base64_bytes.decode('ascii')

        final_result = {
            "Success": "True",
            "Match": round(final_percentage, 2),
            "Image1": image_to_data_url('Annotated_Image1.jpeg'),
            "Image2": image_to_data_url('Annotated_Image2.jpeg'),
            "ErrorImage": image_to_data_url('Error-Image.jpeg')
        }

        resp = json.dumps(final_result)
        return resp

    elif request.method == 'GET':
        return render_template('form.html')


app.run()
